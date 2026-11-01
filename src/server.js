import { app } from "./app.js";

const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Reference API on http://localhost:${port}`));

// graceful shutdown
for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
