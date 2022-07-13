//creating token and saving in the cookie.
const sendToken = (user,statusCode,res,message="")=>{
    //Getting the unique token that has id with it so that we can validate it on while authenicating.
    const token = user.getJWTToken();
    // Options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly:true,
    };

    //Here storing the token in the cookie .
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        message,
        user,
        token,
    });

}

module.exports = sendToken;