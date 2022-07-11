const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/usersModel");
const sendToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
// Register User 
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a sample Id",
      url: "profilepicurl",
    },
  });

  sendToken(user, 201, res, "User Registered succesfully!");
});

/* ------------------------------ Login User ------------------------------*/
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  // checking if the user has provided both the username and password or not
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Valid Email and Password", 400));
  }

  const user = await User.findOne({ email: email }).select("+password");
 
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password); //this returns boolean value.

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(
    user,
    200,
    res,
    `${user.name} with role '${user.role}' logged in. `
  );
});

// Logout user --DONE
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  // res.clearCookie("token");
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: ` Logged out `,
  });
});

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // get reset password token
  const resetToken = user.getResetPasswordToken();
  /*
    'validateBeforeSave'--->, as the name implies, validates the mongoose object before persisting/saving it to database. This is a schema level check, which, if not set to false, will validate every document. It includes both built-in (like a Number cannot contain string or a required field should exist etc.) and custom defined validations.
  */
  await user.save({ validateBeforeSave: false }); //Here we are saving becouse ,user.getResetPasswordToken() that we have called above returned a unique token and have assigned some values in user.resetPasswordToken and  user.resetPasswordExpire, thats why it needs to be stored in db/document.

  const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

  const message = `your password token is \n\n ${resetPasswordUrl} \n\n if you have not requested this email then please ignore it.`;
  
  // Sending mail
  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to user ${user.email} succesfully`,
    });
  } catch (error) {
    /*if any error occurs set undefined to these crucial fields and save it */
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, //gt means greater
  });
  if (!user) {
    return next(
      new ErrorHandler("Reset Password Token is inavlid or has expired", 400)
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// get user details, only logged in user can access this function or see the data
//users can see thier details by using this method
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Update user password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is Incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesnot matched", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// Update user Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: "user updated succesfully",
  });
});

// get all resgisterd users (admin can view details of any user)
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

// get single users (admin can view details of any user)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`user doesnot exists with id ${req.params.id}`)
    );
  }

  res.status(200).json({
    user,
  });
});

// update user role by admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    roll: req.body.roll,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: true,
  });

  res.status(200).json({
    success: true,
    message: "user Role updated succesfully",
  });
});

// delete user by admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHandler(`User doesnot exists with if ${req.params.id}`)
    );
  } else {
    await user.remove();
  }
  res.status(200).json({
    success: true,
    message: "user deleted succesfully",
  });
});
