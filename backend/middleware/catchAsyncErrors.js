module.exports = thefunc => (req,res,next)=>{
    Promise.resolve(thefunc(req,res,next)).catch(next);
}


// function thefunc(){
//     return (req,res,next)=>{
//     Promise.resolve(thefunc(req,res,next)).catch(next);   
//     }
// }
// module.exports = thefunc;