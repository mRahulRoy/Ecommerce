//for refrence of this code : https://javascript.info/custom-errors
class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports = ErrorHandler;