import { randomUUID } from "node:crypto";

const SAFE_ID = /^[A-Za-z0-9_-]{8,64}$/;

// Accept a caller-supplied id only if it is safe (prevents log/header injection).
export function requestId(req, res, next) {
  const incoming = req.get("x-request-id");
  req.id = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.id);
  next();
}
