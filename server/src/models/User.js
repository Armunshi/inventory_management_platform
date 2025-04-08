import {mongoose,Schema} from "mongoose"
const UserSchema = Schema({
    username:{
        type:String,
        required:[true,"Username Is Required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        trim:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        ,'please use a valid email address']
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    role:{
        type:String,
        required:[true,"Please enter your role"]
    }
})


export const User  = mongoose.model('User',UserSchema)