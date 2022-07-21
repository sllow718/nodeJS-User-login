// import mongoose
const mongoose = require("mongoose");

// unique check function
const uniqueValidator = require("mongoose-unique-validator");

// define user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: false },
});

// required for unique validator to work
userSchema.plugin(uniqueValidator);

// export model
// export as User
module.exports = mongoose.model("User", userSchema);
