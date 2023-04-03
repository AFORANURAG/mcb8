const RestaurantRouter = require("express").Router();
const {authenticator} = require("../middlewares/jwtvalidator");
const {userModel,restaurantModel} = require("../models/models");

RestaurantRouter.get("/",(req,res)=>{
    res.status(200).json({message:"done"});
})

RestaurantRouter.post("/createrestaurant",authenticator,async(req,res)=>{
    try {
    let query =new restaurantModel(req.body);
    await query.save();
    res.status(201).json({message:"restaurant created successfully"});
} catch (error) {
    console.log(`error while creating a new restaurant :error is  ${error}`);
    res.status(500).json({message:"server error"})
}  
})
RestaurantRouter.get("/restaurants",authenticator,async(req,res)=>{
   try {
    let allRestaurant = await restaurantModel.find({});
    res.status(200).json({allRestaurant});
   } catch (error) {
    console.log(`error while loading all the restaurant:error is ${error}`);
    res.status(500).json({message:"server error"});
   } 
})

RestaurantRouter.get("/restaurants/:id",authenticator,async(req,res)=>{
    let id = req.params.id;
    try {
        let Restaurantfilteredwithid = await restaurantModel.findById(id);
        res.status(200).json({Restaurantfilteredwithid});
    } catch (error) {
        console.log(`error while loading the restaurant with id ${id}:error is ${error}`);
        res.status(500).json({message:"server error"});
    } 
})


// lets do some mongo db aggregation
// get the menu of a particular restaurant
RestaurantRouter.get("/restaurants/:id/menu",authenticator,async(req,res)=>{
let id = req.params.id;
console.log(id)
try {
    let Restaurantfilteredwithid = await restaurantModel.findById(id);
    console.log(Restaurantfilteredwithid.menu);
    res.status(200).json({...Restaurantfilteredwithid.menu});
    // note we only need menu of restaurant
    //every restaurant has its specific menu;right?
} 
catch (error) {
console.log(`error while loading the restaurant:error is ${error}`);
res.status(500).json({message:"server error"});    
}
})

//update menu by adding one element
RestaurantRouter.patch("/restaurants/:id/menu",authenticator,async(req,res)=>{
// now menu has items or menu is basically an array of objects like this 
// [{},{},{},{},{}];
let id  = req.params.id;
let newmenuitems = req.body;

let updateMenu = await restaurantModel.updateOne({_id:id},{
    $push:{menu:newmenuitems}
}

).then(result=>{
    console.log(result);
    res.status(204).json({message:"item added to menu sccessfully"})
}).catch((err)=>{
    console.log(`error while adding a new item to the menu:error is ${err}`);
    res.status(500).json({message:"server error"});
})
})


RestaurantRouter.delete("/restaurants/:id/menu/:menuid",authenticator,async(req,res)=>{
   // push for appending an elemnent and pull for pulling out a specific a element from array field
  let restaurantid = req.params.id;
  let menuid = req.params.menuid
    restaurantModel.findByIdAndUpdate(
        restaurantid,
        { $pull: { menu: { _id: menuid } } }
      ).then(result => {
          if (!result) {
            throw new Error('error while removing menu from restaurant,the restaurant does not exists');
          }
          res.status(202).json({ message: 'items removed successfully'});
        })
        .catch(err => {
           console.log(`error while deleting items from menu ${err}`); 
          res.status(500).json({ message:"error" });
        });
    })
    module.exports = {RestaurantRouter}