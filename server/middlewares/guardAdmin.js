const guardAdmin = async (req, res, next) => {
  console.log("> req.user", req.user.toJSON());
  if (req.user.role === "Admin") {
    next();
  } else {
    next({ name: "ForbiddenError", message: "Hanya admin yang bisa masuk" });
  }
};
module.exports = guardAdmin;
