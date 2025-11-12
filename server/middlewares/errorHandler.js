module.exports = function errorHandler(err, req, res, next) {
  if (err.name === "BadRequest") {
    res.status(400).json({ message: err.message });
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    res.status(400).json({
      message: err.errors.map((el) => {
        return el.message;
      }),
    });
  } else if (err.name === "UnathorizedError") {
    res.status(401).json({ message: err.message });
  } else if (err.name === "ForbiddenError") {
    res.status(403).json({ message: err.message });
  } else if (err.name === "NotFound") {
    res.status(404).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Internal server error" });
  }
};
