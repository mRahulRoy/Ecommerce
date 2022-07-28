const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt_js = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // builtin module
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    trim: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [5, "Name cannot be less than 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    trim: true,
    unique: true,
    validator: [validator.isEmail, "Enter Valid Email"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    maxLength: [10, "Password cannot be More than 10 characters"],
    minLength: [5, "Password cannot be less than 6 characters"],
    select: false, //this will not give the password when will call it by find method.
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: { type: Date, default: Date.now },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

/*
  Pre-save hooks in mongoose.js
  Syntax: schemaName.pre("event",callback);
     event: we have few events that we can use like 'save', 'remove' etc.
     callback: It is recommended to use function with keyword 'function' so that we can use 'this' object in it and not to use fat arrow function as it does not binds to 'this'.

  This middleware is defined on the schema level , what it dose is, it provides us a two middleware known as 'pre' and 'post' , pre gets invoked or called as soon as the event passed in it gets triggered in our case its 'save' event. so this pre function will get invoked before saving the data in the database and the callback corresponding to that event will get executed.

  Post is same as .pre method, Post gets invoked after the event passed in post function gets executed.
*/
userSchema.pre("save", async function (next) {
  //This is checking if the password is changed/modified or not, if not modified then simply call the next or if has modified then it will not exceute the 'if' body and will hash the password.
  if (!this.isModified("password")) {
    next();
  }
  /*Here we are HASHING the password by 10 salting rounds. And then saving it in the database */
  this.password = await bcrypt_js.hash(this.password, 10);
});

/*
Here we are adding a custom method in the usersSchema named 'getJWTToken' by using a prooperty called "methods" present in the userSchema. It helps in creating a custom method. we can create two types of method on userSchema the first one is (simple method) and another one is (static method). to call simple method just use the collection/record/instance name or create a new model with the new keyword. 
*/

/*Creating JWT Token*/
userSchema.methods.getJWTToken = function () {
  //here we are generating a token and sending some data with this like id or any required detail
  /*JWT sign method is used for creating a token that takes three arguments, one is a response object, and the second one is a secret key and the last one is an options object for better use of the token. */
  /* Syntax: jwt.sign(payload, secretOrPrivateKey, [options, callback])
    If a callback is supplied, the callback is called with the err or the JWT.
  */
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method for comparing Old and New password
userSchema.methods.comparePassword = async function (enteredPassword) {
  //return true of passwords are same else false.
  return await bcrypt_js.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  /* The crypto module provides a way of handling encrypted data. */
  //Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

const User = new mongoose.model("User", userSchema);
module.exports = User;
