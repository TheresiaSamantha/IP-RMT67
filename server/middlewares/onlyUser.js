const { MyList } = require("../models");

const onlyUser = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(); // nothing to check for collection routes

  // Try to find by primary key first
  let cekMyList = await MyList.findByPk(id);
  console.log("🚀 ~ onlyUser ~ cekMyList:", cekMyList);

  // If not found, try to find by (UserId, BookId) — allows passing BookId as param
  if (!cekMyList && req.user && req.user.id) {
    const possible = await MyList.findOne({
      where: { UserId: req.user.id, BookId: Number(id) },
    });
    if (possible) cekMyList = possible;
  }

  if (!cekMyList) {
    return next({ name: "NotFound", message: "Data not found" });
  }

  // MyList stores owner in UserId
  if (req.user && req.user.id === cekMyList.UserId) {
    // attach found item for downstream handlers
    req.myListItem = cekMyList;
    return next();
  } else {
    return next({
      name: "ForbiddenError",
      message: "Bukan pengguna yang bisa akses",
    });
  }
};

module.exports = onlyUser;
