const { MyList } = require("../models");

const onlyUser = async (req, res, next) => {
  const { id } = req.params;
  // console.log("🚀 ~ onlyUser ~ id:", id);
  if (!id) return next(); // collection routes (no :id) skip ownership check

  try {
    const cekMyList = await MyList.findByPk(id);
    // console.log("🚀 ~ onlyUser ~ cekMyList:", cekMyList);
    if (!cekMyList) {
      return next({ name: "NotFound", message: "Data not found" });
    }

    if (req.user && req.user.id === cekMyList.UserId) {
      req.myListItem = cekMyList; // attach for downstream controllers
      return next();
    }

    return next({
      name: "ForbiddenError",
      message: "Bukan pengguna yang bisa akses",
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = onlyUser;
