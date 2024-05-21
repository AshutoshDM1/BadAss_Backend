const validate = (registerSchema) => (req, res, next) => {
  console.log("Validating")
  try {
    const validate = registerSchema.safeParse(req.body);
    if (!validate.success) {
      return res.status(400).json({ error: "Validation failed Enter the correct values" });
  }
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors });
  }
};

module.exports = validate;