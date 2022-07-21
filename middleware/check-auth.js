const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error.js");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      throw new Error("Authentication failed!");
    }
    // gives you the payload you inserted
    const decodedToken = jwt.verify(token, "SUPER_SECRET");
    req.userData = { userId: decodedToken.userId };
    console.log(req.userData.userId);
    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};
