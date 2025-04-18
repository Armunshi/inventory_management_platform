import { User } from "../models/User.js";
import { login, logout, registerNewUser } from "../services/Auth.services.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import { generateCustomId } from "../utils/genCustomId";

const generateAccessAndRefreshTokens  = async (userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = User.generateAccessToken();
        const refreshToken = User.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave:false })

        return {accessToken , refreshToken}


    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating Refresh And Access tokens")
    }
}

const registerUser = asyncHandler( async (req,res) =>{
    const user = await registerNewUser(req.body,req.files)

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const createduser =await User.findById(user._id).select(
        "-password -refreshToken -totalSales -coverImage"
    )
    
    const options = {
        httpOnly:true,
        secure:true
    }
    
    console.log("Cookies set: ", accessToken, refreshToken);

    return res.status(200)
    .cookie("AccessToken" ,accessToken,options)
    .cookie("RefreshToken" ,refreshToken,options)
    .json(
        new ApiResponse(200,{
            user: createduser,
            accessToken,
            refreshToken
        },
        "User Logged in Succesfully"
    )
    )
    

})

const loginUser = asyncHandler(async (req,res)=>{
    

    const LoggedInUser =await  login(req.body)
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(userStudent._id)
    
    const options = {
        httpOnly:true,
        secure:true
    }

    console.log("Cookies set: ", accessToken, refreshToken);

    return res.status(200)
    .cookie("AccessToken" ,accessToken,options)
    .cookie("RefreshToken" ,refreshToken,options)
    .json(
        new ApiResponse(200,{
            user: LoggedInUser,accessToken,refreshToken
        },
        "User Logged in Succesfully"
    )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    
     await logout(req.user._id);
    
    // there is something wrong with cookie clearing part have to resolve later

    const options ={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("AccessToken",options)
    .clearCookie("RefreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"));
})

const refreshAccessToken= asyncHandler(async (req,res)=>{
    try {
        const incomingrefreshToken = req.cookie?.RefreshTokem || req.body.RefreshToken
        
        if (!incomingrefreshToken){
            throw new ApiError(401,"incoming refresh token is invalid")
        }
        const options = {
            httpOnly:true,
            secure:true
        }
        const decodedToken = jwt.verify(incomingrefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user =  await UserStudent.findById(decodedToken?._id)
    
        if (!user){
            throw new ApiError(401,"invalid token")
        }
    
        if (user?.refreshToken !== incomingrefreshToken){
            throw new ApiError(401,"refresh token is expired or used")
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
        
        return res.
        status(200)
        .cookie("studentAccessToken",accessToken,options)
        .cookie("studentRefreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(200,
                {accessToken,refreshToken:newRefreshToken},
            "access token refreshed")
        )
    } catch (error) {
         throw new ApiError(400,error?.message  || "invalid refresh token")
    }
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}