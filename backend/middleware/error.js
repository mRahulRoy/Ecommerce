const ErrorHandler = require("../utils/errorHandler");

//Middleware function
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

 
  console.log("Error : ", err.message);


  // Handling cast error. cast error is occurs when a short id or invalid request is passed instead of the full id. or wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resource Not Found. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
    console.log("This is cast error :", message);
  }

  // mongodb duplicate key error handling here ,eg When a registred user tries to register with the same email then . when a duplicate key entred in mongodb it throws err code : 11000
  if (err.code == 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //wrong jwt error Occurs when a wrong JWT token is submitted
  if (err.name === "JsonWebTokenError") {
    const message = `Json web token is invalid`;
    err = new ErrorHandler(message, 400);
    console.log("This is cast error :", message);
  }
  // jwt expire error
  if (err.name === "TokenExpiredError") {
    const message = `Json web token is Expired,Try again`;
    err = new ErrorHandler(message, 400);
    console.log("This is cast error :", message);
  }

  res.status(err.statusCode).json({
    success: false,
    message : err.message
  });
};
