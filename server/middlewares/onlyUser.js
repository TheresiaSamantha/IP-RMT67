const { Cuisine } = require("../models");

const onlyUser = async (req, res, next) => {
  const { id } = req.params;
  const cekCuisine = await Cuisine.findByPk(id);
  if (!cekCuisine) {
    next({ name: "NotFound", message: "Data not found" });
  }
  // console.log("Id usernya adalah:", cekCuisine.AuthorId);

  // console.log("> req.user", req.user.toJSON());
  if (req.user.id === cekCuisine.AuthorId) {
    next();
  } else if (req.user.role === "Admin") {
    next();
  } else {
    next({ name: "ForbiddenError", message: "Bukan pengguna yang bisa akses" });
  }
};
module.exports = onlyUser;
