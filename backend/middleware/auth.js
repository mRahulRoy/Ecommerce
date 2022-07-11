//Middleware for authentication or authorization
//Mine understanding for this file status: All Good.

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User =  require("../models/usersModel");

//verifying if the user is trying to login or access the resources is valid or not
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;//getting the token from the cookie so that we can compare later
    if(!token){
        return next(new ErrorHandler("Please Login To access Resource",401));
    }
    const decodedData =  jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);
    next();
});


//checking here if the user is an admin or not.
exports.authorizedRoles = (...roles)=>{
    return (req,res,next)=>{
            if(!roles.includes(req.user.role)){
               return next(new ErrorHandler(` ${req.user.role} is not allowed to access this resource`,403));//throwing error becouse the user is not an admin so he cant access the resources that are allowed to admin only.
            }
            next();
    }
}

