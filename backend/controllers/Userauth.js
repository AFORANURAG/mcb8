require("dotenv").config();
const express = require("express");
const AuthRouter = express();
const {userModel} = require("../models/models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
AuthRouter.use(express.json());
AuthRouter.get("/",(req,res)=>{
    res.json({message:"welcome to userauth router"})
})


AuthRouter.post("/login",async(req,res)=>{
const {password,email} = req.body;
let userExist = await userModel.findOne({email});
console.log(userExist)
if(userExist){
    console.log(userExist)
let passwordFromDb = userExist?.password;
bcrypt.compare(password,passwordFromDb,(err,result)=>{
    if(err){
        console.log(err);
        res.status(500).json({message:"server error"})
    }else{
    console.log(result)
   if(result){
       let accessToken = jwt.sign({email,userId:userExist._id},process.env.SECRET_KEY) 

       res.status(200).json({message:"login successfull",accessToken}) 
   }else{
    res.status(400).json({message:"wrong credentials"})
   } 
    }
})
}else{
    res.status(200).json({message:"please register first"});
}
})



AuthRouter.patch("/reset/:id",async(req,res)=>{
let id = req.params.id;
let address = req.body.address;
let {password} = req.body;
console.log(address)
if(!address){
 try {
let newpassword = bcrypt.hashSync(password,10) 
      let resetQuery = await userModel.findByIdAndUpdate({_id:id}, {password:newpassword});
      res.status(204).json({message:"password reset successfully"});  
}catch (error) {
    // console.log(`error while `)
    console.log(`error while reseting the password ${error}`);        
res.status(500).json({message:"server error"});
}
}
else{
    res.status(400).json({message:"bad request, you are not allowed to change your address ,only password can be changed"});
}

})



AuthRouter.post("/register", async(req,res)=>{
// search in the db first

// console.log(req.body)
let doesUserAlreadyexists = await userModel.findOne({email: email});
console.log(doesUserAlreadyexists)
if(!doesUserAlreadyexists){
    try {
     bcrypt.hash(password,10, async(err,hash)=>{
        if(err){
            console.log(err)
        }else{
            // console.log(hash)
            let query = await userModel({...req.body,password:hash});
await query.save()
res.status(201).json({message:"user account created successfully"})
        }
     })   
    } catch (error) {
        console.log(`error while registering the user :error is ${error}`)
        res.status(500).json({message:"server error"})
    }
}else{
    res.status(400).json({message:"user already exists"})
}
})


module.exports = {AuthRouter}