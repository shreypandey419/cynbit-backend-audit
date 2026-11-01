import rateLimit from "express-rate-limit";

// Factory so every app instance (and every test) gets its own counter.
export function createContactLimiter({ max = 5, windowMs = 15 * 60 * 1000 } = {}) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      res.status(429).json({
        error: { code: "RATE_LIMITED", message: "Too many requests, try later", requestId: req.id },
      }),
  });
}
