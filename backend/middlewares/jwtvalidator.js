require("dotenv").config();
const JWT=require("jsonwebtoken")
const authenticator=(req,res,next)=>{
// this middlware is going to be used for every protected path
// console.log(req.headers)
let token=req.headers.authorization.split(" ")[1]
try {
    let decoded=JWT.verify(token,process.env.SECRET_KEY)
    if(decoded){
    console.log(decoded);
        if(!req.body.userid){

        req.body.userid=decoded.userId
    }
    next()
    } 
} catch (error) {
    console.log(`error processing the request:error is ${error}`)
    res.send({"message":"Please login first"})
}
}
module.exports={authenticator}