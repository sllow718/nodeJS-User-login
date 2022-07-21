// import custom httperror model
const HttpError = require("../models/http-error");

// get validation result from routes
const { validationResult } = require("express-validator");

// import password encryption function
const bcrypt = require("bcryptjs");

// import jwt tool
const jwt = require("jsonwebtoken");

//import user model
const User = require("../models/users");

// get all user function
const getUsers = async (req, res, next) => {
  let users;
  try {
    // get all users, exclude password
    users = await User.find({}, "-password");
  } catch (err) {
    // return error if above fails
    return next(new HttpError("Unable to get users", 500));
  }

  res
    // send back status 200 to indicate ok
    .status(200)
    // to de-objectify parameters that are in object format (i.e _id -> id)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// user sign up
const userSignUp = async (req, res, next) => {
  // check if there are any errors from the validation request under routes
  // if theres an error, return proper params
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  // get required params from request
  const { username, email, password } = req.body;
  console.log(req.body);

  // check if existing email/username exists
  let existingEmail;
  let existingUsername;

  try {
    existingEmail = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Unable to check if existing email exist", 500));
  }

  try {
    existingUsername = await User.findOne({ username: username });
  } catch (err) {
    return next(
      new HttpError("Unable to check if existing username exist", 500)
    );
  }

  // return error if there is existing email
  if (existingUsername || existingEmail) {
    const error = new HttpError(
      "email or username already exist, please log-in",
      422
    );
    return next(error);
  }

  // hash password for storage
  try {
    // hash password
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return new HttpError("Hash password error", 500);
  }

  // init new user with given params
  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    image:
      "https://media.istockphoto.com/vectors/default-gray-placeholder-man-vector-id871752462?k=20&m=871752462&s=612x612&w=0&h=BTrZB8slanBvVw-1hwwf8mew5HkpDOyHIJAWDdBwIr8=",
  });

  //save user
  try {
    await newUser.save();
  } catch (err) {
    return next(new HttpError("Correct inputs given, but unable to save", 500));
  }

  //return jwt token
  let token;
  try {
    // jwt sign takes in 3 params
    // 1. payload, 2. secretkey, 3. other params (read docs bro)
    token = jwt.sign(
      { userId: newUser.id, username: newUser.username, email: newUser.email },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("JWT token creation error", 500));
  }

  // send status 201 for creation and return token details
  res.status(201).json({ token: token });
};
// user log in
const userLogin = async (req, res, next) => {
  // check if there are any errors from the validation request under routes
  // if theres an error, return proper params
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed", 422));
  }

  // get required params from req.body
  const { username, password } = req.body;

  // check if user is valid
  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("Unable to login", 500);
    return next(error);
  }

  // if no user return error
  if (!identifiedUser) {
    return next(new HttpError("No such user found", 401));
  }

  // validate password
  let isValidPassword = false;
  try {
    // hashing password decrypt
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
  } catch (err) {
    return next(new HttpError("Password check error, bcrypt issue", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("Correct user but incorrect password", 401));
  }

  //set token when login
  let token;
  try {
    token = jwt.sign(
      {
        userId: identifiedUser.id,
        username: identifiedUser.username,
        email: identifiedUser.email,
      },
      `${process.env.JWT_KEY}`,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("JWT token creation error", 500));
  }

  // send status 200 for login success and return token details
  res.status(200).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    token: token,
  });
};

// updateUser
const userUpdatePassword = async (req, res, next) => {
  // check if there are any errors from the validation request under routes
  // if theres an error, return proper params
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Please enter updated password", 422));
  }

  // get required params
  const { currentPassword, newPassword } = req.body;
  const userId = req.params.uid;

  //if incorrect cookie check
  if (userId !== req.userData.userId) {
    return next(new HttpError("Invalid cookie", 401));
  }

  // get user
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    return next(new HttpError("unable to get user id to update password", 500));
  }

  if (!user) {
    return next(new HttpError("No such user!", 500));
  }
  // check if current password is valid
  let isValidPassword = false;
  try {
    // hashing password decrypt
    isValidPassword = await bcrypt.compare(currentPassword, user.password);
  } catch (err) {
    return next(new HttpError("bcrypt validation error", 500));
  }
  // if invalid password, return error
  if (!isValidPassword) {
    return next(new HttpError("Incorrect current password", 401));
  }

  // hash password for storage
  try {
    // hash password
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    return new HttpError("Hash password error", 500);
  }

  // update userpassword
  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    return next(new HttpError("Failed to save new password"));
  }

  res.status(200).json({ message: "new password saved!" });
};

exports.getUsers = getUsers;
exports.userSignUp = userSignUp;
exports.userLogin = userLogin;
exports.userUpdatePassword = userUpdatePassword;
