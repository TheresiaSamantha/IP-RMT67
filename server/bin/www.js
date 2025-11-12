const app = require("../app");
// app listener
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server can be access in http://127.0.0.1:${PORT}`);
});
