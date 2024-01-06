import mongoose from "mongoose";
import { boolean } from "zod";

    const userSchema = new mongoose.Schema({
        id:{
            type:String, 
            required:true
        },
        username:{
            type:String, 
            required:true,
            unique:true
        },
         name:{
            type:String, 
        },
        bio:{
            type:String, 
        },
        image:{
            type:String, 
        },
        threads:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Thread"
        }],
        communities:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Community"
        }],
        onboarded:{
            type:Boolean,
            default:false
        }
    })

 const User = mongoose.models.User ||  mongoose.model("User",userSchema);
 export default User