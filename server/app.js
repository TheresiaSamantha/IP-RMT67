// buatkan basic express server di app.js dengan port 3000
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

const Controller = require("./controllers/controller.js");
const UserController = require("./controllers/controllerUser.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", Controller.home);
app.get("/openai", Controller.OpenAi);
app.post("/register", UserController.register);
app.post("/login", UserController.login);

module.exports = app;
