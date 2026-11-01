import express from "express";
import { security } from "./middleware/security.js";
import { requestId } from "./middleware/requestId.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { createContactRouter } from "./routes/contact.js";

export function createApp(opts = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestId);
  app.use(security);
  // API responses must never be cached by shared caches
  app.use((req, res, next) => { res.set("Cache-Control", "no-store"); next(); });
  app.use(express.json({ limit: "10kb" }));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.get("/ready", (req, res) => res.json({ status: "ready" }));
  app.use("/api/contact", createContactRouter(opts));

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export const app = createApp();
