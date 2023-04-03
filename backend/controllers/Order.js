const OrderRouter = require("express").Router();
const {authenticator} = require("../middlewares/jwtvalidator");
const {userModel,restaurantModel,orderModel} = require("../models/models");
const mongoose = require("mongoose");

OrderRouter.post("/orders",authenticator,async(req,res)=>{
let userid = req.body.userid
try {
 let createNewOrder = new orderModel({user:userid,...req.body});
   await createNewOrder.save();
   res.status(201).json({message:"ordered booked successfully"});
} catch (error) {
    console.log(`error while creating a new order .error is ${error}`);
    res.status(400).json({message:"server error"});
}
});

OrderRouter.get("/orders/:id",authenticator,async(req,res)=>{
   let orderId = req.params.id;
   console.log(orderId)
    try {
        const order = await orderModel.findById(orderId).populate('user').populate('restaurant');
res.status(200).json(orderById);
    } catch (error) {
        console.log(`error while loading the order with orderid ${orderId}.Error is ${error}`);
        res.status(500).json({message:"server error please try again later"});
    }
})

OrderRouter.patch("/orders/:id",authenticator,async(req,res)=>{
    let orderId = req.params.id;
    let newstatus = req.body.status;
     try {
       let orderById = await orderModel.findByIdAndUpdate({orderId},{status:newstatus});  
     res.status(204).json(orderById);
     } catch (error) {
         console.log(`error while updating the order with orderid ${orderId}.Error is ${error}`);
         res.status(500).json({message:"server error please try again later"});
     }
 })
 
 module.exports = {OrderRouter}