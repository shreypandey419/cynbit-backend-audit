import helmet from "helmet";
import cors from "cors";
import compression from "compression";

const origins = (process.env.ALLOWED_ORIGINS || "http://localhost:3000")
  .split(",").map((s) => s.trim());

export const security = [
  helmet({
    contentSecurityPolicy: { directives: { defaultSrc: ["'self'"], scriptSrc: ["'self'"] } },
    hsts: { maxAge: 31536000, includeSubDomains: true },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
  cors({
    origin: (origin, cb) =>
      !origin || origins.includes(origin) ? cb(null, true) : cb(new Error("CORS_BLOCKED")),
    methods: ["GET", "POST"],
  }),
  compression(),
];
