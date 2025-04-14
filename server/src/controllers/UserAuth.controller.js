import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { generateCustomId } from "../utils/genCustomId";

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
    
    
    const { 
        username,
        email, 
        password,
        role,
        address,
        phone } = req.body
        
        // 2 check
    if ([username,email,password,role,address].some((field)=>
        field?.trim() === "")){
            throw new ApiError(400,"The Highlighted fields are required")
        }
        
        
        // 3 existence
    const existedUser =await User.findOne({
            $and: [{ email },{ username },{role}]
        })

    
    let counterKey;
    if (role === 'retailer') counterKey = 'retailerId';
    else if (role === 'supplier') counterKey = 'supplierId';
    else if (role === 'admin') counterKey = 'adminId';
    else return res.status(400).json({ error: 'Invalid role' });

    const sequence = await getNextSequence(counterKey);   
    const customId = generateCustomId(role,sequence);

    if (existedUser){
        throw new ApiError(409,"User with email or username already exits");
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;



    if (avatarLocalPath ){
        const avatar = await uploadOnCloudinary(avatarLocalPath)
        const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        if (!avatar){
            throw new ApiError(400,"Avatar is required")
        }
    }
   

    const user = await User.create({
        customId,
        username,
        email,
        password,
        role,
        address,
        phone: phone.empty() ?"":phone
    })

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const createduser =await User.findById(user._id).select(
        "-password -refreshToken"
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
            user: createdStudent,
            accessToken,
            refreshToken
        },
        "User Logged in Succesfully"
    )
    )
    

})

const loginUser = asyncHandler(async (req,res)=>{
    

    const {id,email,password,role} = req.body;
    if (!email || !password || !role){
        throw new ApiError(400,"email or password is required")
    }

    const user =await user.findOne({email});

    if (!user){
        throw new ApiError(404,'no such user exists')
    }
    
    

    const isPasswordValid = await userStudent.isPasswordCorrect(password)
    if (!isPasswordValid){
        throw new ApiError(401,'Invalid User Credentials')
    }
    
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(userStudent._id)

    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken ")
    
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
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
            
        },{
            new:true
        }
    )
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