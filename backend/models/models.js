const mongoose = require("mongoose");
const userSchema =new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    }
  } 
)
const userModel = mongoose.model("user",userSchema);

const restaurantModel = mongoose.model("restaurant",mongoose.Schema(
  {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    },
    menu: [{
      _id: {type:mongoose.Schema.Types.ObjectId,auto:true},
      name: String,
      description: String,
      price: Number,
      image: String
    }]
  } 
))


const orderModel = mongoose.model("order1",mongoose.Schema(
{  user : { type: mongoose.Schema.Types.ObjectId, ref: 'userModel' },
    restaurant : { type: mongoose.Schema.Types.ObjectId, ref: 'restaurantModel' },
    items: [{
      name: String,
      price: Number,
      quantity: Number
    }],
    totalPrice: Number,
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    },
    status: String 
 }
));


module.exports = {userModel,restaurantModel,orderModel};