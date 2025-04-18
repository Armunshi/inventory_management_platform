import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { generateCustomId } from "../utils/genCustomId.js";
import { getNextSequence } from "../utils/getNewSequence.js";

const registerNewUser = async (userData,files) =>{
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
    else if (role === 'admin') counterKey = 'adminId';
    else return res.status(400).json({ error: 'Invalid role' });

    const sequence = await getNextSequence(counterKey);   
    const customId = generateCustomId(role,sequence);

    if (existedUser){
        throw new ApiError(409,"User with email or username already exits");
    }


    const avatarLocalPath = files?.avatar[0]?.path;
    const coverImageLocalPath = files?.coverImage[0]?.path;



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
        coverImage,
        role,
        address,
        phone: phone.empty() ?"":phone
    })
    return user
}

const login = async (userData)=>{
    const {email,password} = userData;
    
    if (!email || !password){
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