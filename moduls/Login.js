const mongoose=require('mongoose')

const LoginSchema = new mongoose.Schema({

email:String,
password:String

})
const Loginmodel=mongoose.model("login",LoginSchema)
module.exports=Loginmodel