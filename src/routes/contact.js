import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.js";
import { createContactLimiter } from "../middleware/rateLimit.js";

export const ContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().optional(), // honeypot, handled before validation
});

// Honeypot: bots fill hidden fields. Pretend success, store nothing,
// so the bot gets no signal about what to change.
function honeypot(req, res, next) {
  if (typeof req.body?.website === "string" && req.body.website.length > 0) {
    console.log(JSON.stringify({ level: "warn", requestId: req.id, event: "honeypot_hit" }));
    return res.status(201).json({ ok: true, requestId: req.id });
  }
  next();
}

export function createContactRouter({ rateLimitMax = 5, onMessage = () => {} } = {}) {
  const router = Router();
  router.post(
    "/",
    createContactLimiter({ max: rateLimitMax }),
    honeypot,
    validate(ContactSchema),
    (req, res) => {
      onMessage(req.data); // swap for DB insert (parameterized) + email queue
      console.log(JSON.stringify({ level: "info", requestId: req.id, event: "contact_received" }));
      res.status(201).json({ ok: true, requestId: req.id });
    }
  );
  return router;
}
