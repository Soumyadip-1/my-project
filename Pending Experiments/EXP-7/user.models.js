const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    location:String,

})

const UserModel=mongoose.model("user",userSchema)

module.exports=UserModel;