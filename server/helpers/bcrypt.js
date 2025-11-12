const bcrypt = require("bcryptjs");

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

async function hashPassword(plain) {
  if (!plain) throw new Error("Password is required for hashing");
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashed = bcrypt.hashSync(plain, salt);
  return hashed;
}

async function comparePassword(plain, hash) {
  if (!plain || !hash) return false;
  const match = bcrypt.compareSync(plain, hash);
  return match;
}

module.exports = { hashPassword, comparePassword };
