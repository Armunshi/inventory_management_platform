import {mongoose,Schema} from "mongoose"
import bcrypt from "bcrypt"
import  jwt  from "jsonwebtoken"

const UserSchema = Schema({
    customId:{
        type:String,
        unique:true,
    },
    username:{
        type:String,
        required:[true,"Username Is Required"],
        trim:true,
        unique:true
    },
    phone:{
        type:String,
        required:false,
        unique:true
    },
    address:{
        type:String,
        required:true,
        trim:true
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
        enum:['admin','retailer','supplier'],
        required:[true,"Please enter your role"]
    },
    avatar: {
        type: String, // cloudinary url
        required: false
    },
    coverImage: {
        type: String,
        required:false // cloudinary url
    },
    // for supplier
    totalSales:{
        type:Number,
        default:0 ,
        required:false
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password,10)
    next()
})


UserSchema.methods.isPasswordCorrect = async function 
(password) {
    return await bcrypt.compare(password,this.password)
}
UserSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            _id: this._id,
            email:this.email,
            username:this.username,
            role:this.role
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,{
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User  = mongoose.model('User',UserSchema)