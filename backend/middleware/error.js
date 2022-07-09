const ErrorHandler = require("../utils/errorHandler");

//Middleware function
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    console.log("MiddleWARE IS CALLELD  ", err.message)

    // Handling cast error. cast error is occurs when a short id or invalid request is passed instead of the full id.
    if (err.name === "CastError") {
        const message = `Resource Not Found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
        console.log("This is cast error :",message);
    }


    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });

}