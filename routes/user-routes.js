//standard imports
const express = require("express");

// function to check POST/PATCH request
// backend validation
const { check } = require("express-validator");

// check auth
const checkAuth = require("../middleware/check-auth");

//set up express router
const router = express.Router();

//import User controller
const userController = require("../controllers/user-controller");
//set up routes

// get all users
router.get("/", userController.getUsers);

// user sign up
router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  userController.userSignUp
);

// user login
router.post(
  "/login",
  [check("username").not().isEmpty(), check("password").not().isEmpty()],
  userController.userLogin
);

// check token
// need to send with authorization
// check headers -> key: authorization value: bearer <token>
router.use(checkAuth);

// user update password
router.patch(
  "/update/:uid",
  [
    check("currentPassword").not().isEmpty(),
    check("newPassword").not().isEmpty(),
  ],
  userController.userUpdatePassword
);

//export
module.exports = router;
