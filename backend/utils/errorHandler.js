//for refrence of this code : https://javascript.info/custom-errors
//Mine understanding for this file status: All Good but study more about Error class.

class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
    console.log("ErrorHandler class constructor called");
  }
}
module.exports = ErrorHandler;
