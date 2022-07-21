//standard imports
const express = require("express");
const bodyParser = require("body-parser");

//moongoose setup
const mongoose = require("mongoose");
const mongoDbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mkmgp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// const mongoDbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mkmgp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

//custom httperror model
const HttpError = require("./models/http-error");

// import User routes
const userRoutes = require("./routes/user-routes");

//set up express & bodyparser
const app = express();
app.use(bodyParser.json());

//to enable access from all browsers and methods
//prevent CORs error
app.use((req, res, next) => {
  // '*' enable access to all domains
  res.setHeader("Access-Control-Allow-Origin", "*");
  // set allowed headers
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // set allowed methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  //
  next();
});

//set routes
// user login, create account, getuser
app.use("/api/users", userRoutes);

//if route not found
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//catch all other error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

//init connection to mongoDB
mongoose
  .connect(mongoDbUrl)
  .then(() => {
    app.listen(process.env.PORT || 8000);
    console.log("connection established!");
  })
  .catch((err) => {
    console.log(err);
  });
