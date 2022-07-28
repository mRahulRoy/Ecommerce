//Mine understanding for this file status: All Good.
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/usersModel");
const sendToken = require("../utils/jwtTokens");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");

/* ------------------------------ Register User ------------------------------*/

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const my_cloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    avatar: {
      public_id: my_cloud.public_id,
      url: my_cloud.secure_url,
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
    //here basically a middleware called error.js will be called with the ErrorHandler as an argument
  }

  sendToken(
    user,
    200,
    res,
    `${user.name} with role '${user.role}' logged in. `
  );
});

/* ------------------------------ Logout User ------------------------------*/

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies; //getting the saved token from cookie so that i can get id of the logged in user.
  if (!token) {
    return next(new ErrorHandler(`Login first you fool`, 404));
  }
  /*JWT verify method is used for verifying the token that takes two arguments one is token string value, and second one is secret key for matching the token is valid or not. The validation method returns a decode object that we stored the token in. */
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decodedData.id);

  // res.clearCookie("token");
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: `${user.role} ${user.name} Logged out `,
  });
});

/* ------------------------------ Forgot Password ------------------------------*/

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User not found", 404));

  // get reset password token
  const resetToken = user.getResetPasswordToken();
  /*
    'validateBeforeSave'--->, as the name implies, validates the mongoose object before persisting/saving it to database. This is a schema level check, which, if not set to false, will validate every document. It includes both built-in (like a Number cannot contain string or a required field should exist etc.) and custom defined validations.
  */
  await user.save({ validateBeforeSave: false }); //Here we are saving becouse ,user.getResetPasswordToken() that we have called above returned a unique token and have assigned some values in user.resetPasswordToken and  user.resetPasswordExpire in that function, thats why it needs to be stored in db/document.

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

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
      message: `Email sent to user ${user.email} succesfully. Please check your email`,
    });
  } catch (error) {
    /*if any error occurs set undefined to these crucial fields and save it */
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

/* ------------------------------ Reset Password ------------------------------*/

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Finding the user based on the resetpassword that we got through the url/parameter
  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, //Here we are also searching if the expire time is greater then give its details , for ex : if current time is 5pm then expire time must be graeter then 5pm.
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
  //deleting or currpupting the password reset token once the password has changed so that user can not changed the password again and again by using the same token.
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// Get user details, only logged in user can access this function or see the data
//users can see thier details by using this method
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  //here we can access req.user becouse it was created in AuthenticatedUser Middleware function so its having all the details of the user.
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

/* --------------------------- Update User Password ---------------------------*/

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  //here we can access req.user becouse its created in AuthenticatedUser Middleware function so its having all the details of the user.
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is Incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not matched", 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

/* --------------------------- Update User Profile ---------------------------*/

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if(req.body.avatar!== ""){
    const user = await User.findById(req.user.id);
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);
    const my_cloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });
    newUserData.avatar = {
      public_id: my_cloud.public_id,
      url: my_cloud.secure_url,
    }
  }



  //here we can access req.user becouse its created in AuthenticatedUser Middleware function. so its having all the details of the user.
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

/*------ get all registerd users (admin can view details of any user) -----*/

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    users,
  });
});

/*----get single users (admin can view details of any user)----*/

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

/*------------------ Update User Role By Admin-------------------*/

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

/*--------------- delete user by admin ------------------------*/

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
