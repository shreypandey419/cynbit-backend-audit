export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten().fieldErrors,
        requestId: req.id,
      },
    });
  }
  req.data = parsed.data;
  next();
};
