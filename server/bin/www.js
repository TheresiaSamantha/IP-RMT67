const app = require("../app");

// Prefer PORT from environment (used by AWS/EB/containers); fallback to 3000 for local dev
const PORT = Number(process.env.PORT);

app.listen(PORT, HOST, () => {
  console.log(`Server listening on Port:${PORT}`);
});
