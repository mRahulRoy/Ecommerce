// module.exports = thefunc => (req,res,next)=>{
//     console.log("Err func called")

//     Promise.resolve(thefunc(req,res,next)).catch(next);
// }

module.exports = function (thefunc) {
    return async function (req, res, next) {
        console.log("Err func called")
        console.log("functiom os ", thefunc)
        return Promise.resolve(thefunc(req, res, next)).catch(next);
        console.log("Valuse is : ", val);
    };
};