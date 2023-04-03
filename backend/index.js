const express = require("express");
const cors = require("cors")
const app = express();
const {connection} = require("./config/db.config");
const {AuthRouter} = require("./controllers/Userauth");
const {RestaurantRouter} = require("./controllers/Restaurant");
const { OrderRouter} = require("./controllers/Order")
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.use("/auth",AuthRouter);
app.use("/orders",OrderRouter);
app.use("/restaurants",RestaurantRouter);

app.get("/",(req,res)=>{
    res.status(200).json({message:"welcome to the base route"})
})

app.listen(process.env.PORT||8080,async ()=>{
    try {
        await connection;
        console.log("connected to db successfully");
        console.log(`listening on port ${process.env.PORT||8080}`)
    } catch (error) {
       console.log(`error while connecting to the database :error is ${error}`) 
    }
})

