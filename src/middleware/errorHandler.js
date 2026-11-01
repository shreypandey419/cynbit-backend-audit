export function notFound(req, res) {
  res.status(404).json({
    error: { code: "NOT_FOUND", message: "Route not found", requestId: req.id },
  });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(JSON.stringify({ level: "error", requestId: req.id, msg: err.message }));
  const status = err.status || (err.message === "CORS_BLOCKED" ? 403 : 500);
  res.status(status).json({
    error: {
      code: status === 500 ? "INTERNAL_ERROR" : err.code || "REQUEST_ERROR",
      message: status === 500 ? "Something went wrong" : err.message,
      requestId: req.id,
    },
  });
}
