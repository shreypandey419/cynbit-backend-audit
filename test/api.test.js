import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";

async function start(opts) {
  const server = await new Promise((r) => { const s = createApp(opts).listen(0, () => r(s)); });
  return { server, base: `http://127.0.0.1:${server.address().port}` };
}
const post = (base, body, headers = {}) =>
  fetch(`${base}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
const valid = { name: "Test User", email: "test@example.com", message: "Hello, this is a test message." };

async function withApp(opts, fn) {
  const { server, base } = await start(opts);
  try { await fn(base); } finally { server.close(); }
}

test("security headers present, x-powered-by absent", () =>
  withApp({}, async (base) => {
    const res = await fetch(`${base}/health`);
    assert.ok(res.headers.get("strict-transport-security"));
    assert.ok(res.headers.get("content-security-policy"));
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.ok(res.headers.get("x-frame-options"));
    assert.ok(res.headers.get("referrer-policy"));
    assert.equal(res.headers.get("x-powered-by"), null);
  }));

test("valid contact payload -> 201", () =>
  withApp({}, async (base) => {
    const res = await post(base, valid);
    assert.equal(res.status, 201);
    assert.equal((await res.json()).ok, true);
  }));

test("invalid payloads -> 422 with field details", () =>
  withApp({ rateLimitMax: 100 }, async (base) => {
    const cases = [
      [{ name: "a", email: "bad", message: "short" }, ["name", "email", "message"]],
      [{ ...valid, email: "not-an-email" }, ["email"]],
      [{ ...valid, message: "x".repeat(2001) }, ["message"]],
      [{}, ["name", "email", "message"]],
    ];
    for (const [body, fields] of cases) {
      const res = await post(base, body);
      assert.equal(res.status, 422);
      const json = await res.json();
      assert.equal(json.error.code, "VALIDATION_ERROR");
      for (const f of fields) assert.ok(json.error.details[f], `missing detail for ${f}`);
    }
  }));

test("oversized body -> 413", () =>
  withApp({}, async (base) => {
    const res = await post(base, { ...valid, message: "x".repeat(20000) });
    assert.equal(res.status, 413);
  }));

test("rate limit -> 429 with Retry-After", () =>
  withApp({ rateLimitMax: 2 }, async (base) => {
    assert.equal((await post(base, valid)).status, 201);
    assert.equal((await post(base, valid)).status, 201);
    const res = await post(base, valid);
    assert.equal(res.status, 429);
    assert.ok(res.headers.get("retry-after"));
    assert.equal((await res.json()).error.code, "RATE_LIMITED");
  }));

test("honeypot hit -> silent 201, nothing stored", () => {
  const stored = [];
  return withApp({ onMessage: (m) => stored.push(m) }, async (base) => {
    const res = await post(base, { ...valid, website: "http://spam.example" });
    assert.equal(res.status, 201);
    assert.equal(stored.length, 0);
    await post(base, valid);
    assert.equal(stored.length, 1);
  });
});

test("CORS: allowed origin passes, unknown origin blocked", () =>
  withApp({}, async (base) => {
    const ok = await fetch(`${base}/health`, { headers: { origin: "http://localhost:3000" } });
    assert.equal(ok.status, 200);
    assert.equal(ok.headers.get("access-control-allow-origin"), "http://localhost:3000");
    const bad = await fetch(`${base}/health`, { headers: { origin: "https://evil.example" } });
    assert.equal(bad.status, 403);
  }));

test("unknown route -> clean JSON 404", () =>
  withApp({}, async (base) => {
    const res = await fetch(`${base}/nope`);
    assert.equal(res.status, 404);
    assert.equal((await res.json()).error.code, "NOT_FOUND");
  }));

test("malformed JSON -> 400, no stack trace leaked", () =>
  withApp({}, async (base) => {
    const res = await post(base, "{bad json");
    assert.equal(res.status, 400);
    const text = await res.text();
    assert.ok(!/node_modules|at \w+ \(|\.js:\d+/.test(text), "stack trace leaked");
  }));

test("request id: safe id echoed, unsafe replaced", () =>
  withApp({}, async (base) => {
    const a = await fetch(`${base}/health`, { headers: { "x-request-id": "abc12345-test" } });
    assert.equal(a.headers.get("x-request-id"), "abc12345-test");
    const b = await fetch(`${base}/health`, { headers: { "x-request-id": "bad id;<script>" } });
    assert.notEqual(b.headers.get("x-request-id"), "bad id;<script>");
  }));

test("health, ready and API no-store", () =>
  withApp({}, async (base) => {
    assert.equal((await fetch(`${base}/ready`)).status, 200);
    const res = await fetch(`${base}/health`);
    assert.equal(res.headers.get("cache-control"), "no-store");
  }));
