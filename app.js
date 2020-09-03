require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes");
const middleWare = require("./utils/middlewares");
app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(morgan("common"));

// public routes
app.use("/auth/", routes.auth);

// private routes
app.use(middleWare.checkToken);
app.use("/users/", routes.users);

module.exports = app;
