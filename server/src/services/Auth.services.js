import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateCustomId } from "../utils/genCustomId.js";
import { getNextSequence } from "../utils/getNewSequence.js";

const registerNewUser = async (userData,files,res) =>{
    const { 
        username,
        email, 
        password,
        role,
        address,
        phone } = userData
        
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
    else if (role === 'admin'||role ==='Admin') counterKey = 'adminId';
    else throw new ApiError(500,'wrong role')

    const sequence = await getNextSequence(counterKey);   
    const customId = generateCustomId(role,sequence);

    if (existedUser){
        throw new ApiError(409,"User with email or username already exits");
    }


    const avatarLocalPath = files?.avatar[0]?.path;
    // const coverImageLocalPath = files?.coverImage[0]?.path;



    const avatar = await uploadOnCloudinary(avatarLocalPath)
    
        console.log(avatar)
        // const coverImage = await uploadOnCloudinary(coverImageLocalPath)
        if (!avatar){
            throw new ApiError(400,"Avatar is required")
        }
        
    
   

    const user = await User.create({
        customId,
        username,
        email,
        avatar:avatar.secure_url,
        password,
        role,
        address,
        phone: phone.trim() || ""
    })
    return user
}

const login = async (userData)=>{
    const {username,password} = userData;
    
    if (!username || !password){
        throw new ApiError(400,"email or password is required")
    }

    const user = await User.findOne({username});

    if (!user){
        throw new ApiError(404,'no such user exists')
    }
    
    

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid){
        throw new ApiError(401,'Invalid User Credentials')
    }
    
    const LoggedInUser = await User.findById(user._id).select("-password -refreshToken ")
    return LoggedInUser;
}

const logout =async (userId)=>{
    return await User.findByIdAndUpdate(
        userId,
        {
            $set:{
                refreshToken:undefined
            }
            
        },{
            new:true
        }
    )
}

export {
    registerNewUser,
    login,
    logout
}