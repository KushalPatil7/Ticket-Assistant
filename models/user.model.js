import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    emai:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        role:{
            type:String,
            default:"user",
            enum:["user", "admin","moderator"]
        },
        skills:[String],
        createdAt:{
            type:Date,
            default:Date.now
        }
    }
})

export default mongoose.model("User",userSchema)