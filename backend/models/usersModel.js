const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt_js = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // builtin module
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    // trim: true,
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [5, "Name cannot be less than 5 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    // trim: true,
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt_js.hash(this.password, 10);
});

// TWT token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt_js.compare(enteredPassword, this.password);
};

// generating passwrod reset token
userSchema.methods.getResetPasswordToken = function () {
  // generating token
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
