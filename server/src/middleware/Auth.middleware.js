import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt  from "jsonwebtoken"
const verifyUser = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace(/^Bearer\s/,"").trim();
        console.log(token)
        if (!token){
            throw new ApiError(401,"Unauthorized reqiest")
        }
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken")
        
        if (!user){
            // Next discusssion front end
            throw new ApiError(401,"Invalid Access Token")
        }
        req.user = user
    } catch (error) {
        throw new ApiError(401,error?.message || 
            "Invalid Access Token"
        )
    }
})
export  {verifyUser}