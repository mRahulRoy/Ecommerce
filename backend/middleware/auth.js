const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User =  require("../models/usersModel");

exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login To access Resource",401));
    }
    // console.log(token)
    const decodedData =  jwt.verify(token,process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    next();
});

exports.authorizedRoles = (...roles)=>{
    return (req,res,next)=>{
            if(!roles.includes(req.user.role)){
               return next(new ErrorHandler(` ${req.user.role} is not allowed to access this resource`,403));
            }
            next();
    }
}

