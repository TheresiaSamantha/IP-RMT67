// buatkan basic express server di app.js dengan port 3000
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

//middleware
const authentication = require("./middlewares/authentication.js");
const onlyUser = require("./middlewares/onlyUser.js");
const errorHandler = require("./middlewares/errorHandler.js");

const Controller = require("./controllers/controller.js");
const UserController = require("./controllers/controllerUser.js");
const ControllerMyList = require("./controllers/controllerMyList.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", Controller.home);
app.get("/books", Controller.getBooks);
app.get("/books/:id", Controller.getDetailBook);
// app.get("/openai", Controller.OpenAi);
app.post("/register", UserController.register);
app.post("/login", UserController.login);
app.post("/login/google", UserController.googleLogin);

app.use(authentication);

// mylist routes: authentication applied globally above; onlyUser middleware is for routes with :id
app.get("/mylist", ControllerMyList.getMyList);
// Allow adding by POST /mylist/:id (where :id is BookId) or POST /mylist with JSON body { BookId, note }
// Add by POST /mylist/:id (where :id is BookId). No request body required.
app.post("/mylist/:id", ControllerMyList.addToMyList);
app.patch("/mylist/:id", onlyUser, ControllerMyList.updateNote);
app.delete("/mylist/:id", onlyUser, ControllerMyList.deleteFromMyList);

app.use(errorHandler);

module.exports = app;
