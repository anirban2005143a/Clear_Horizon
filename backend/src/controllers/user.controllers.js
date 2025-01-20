import {asyncHandler} from "../utils/asyncHandler.js"; // writing extension also because if not written then it shows  an error
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateAccessAndRefreshTokens= async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
                return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


// registring the user
const registerUser= asyncHandler(async (req , res) => {
  
const {fullName, email, username, password}=req.body;
console.log("email:", email);



if([fullName,email,username,password].some((field)=> field?.trim()==="")){
    throw new ApiError(400, "All fields are required")

    
} 



const existedUser=await User.findOne({
    $or: [{username}, {email}] 
})
if(existedUser){
    throw new ApiError(409, "User with email or username already exists")
}



//  const avatarLocalPath=req.files?.avatar[0]?.path;

// let coverImageLocalPath;
// if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    
    
//     coverImageLocalPath = req.files.coverImage[0].path;
// } 
// console.log(req.files)
// just to check what req.files returns
// req.files returns an object with avatar and coverImage being as key and their value an array comprising of some data
// if(!avatarLocalPath){
//     throw new ApiError(400 , "Avatar file is required")
// }   

// below code for 5)
// since uploading to cloudinary takes timer therefore await used
// although we have async handler here still we used await because we intentionally want to stop execution of code until both files are not uplloaded to cloudinary 
// const avatar = await uploadOnCloudinary(avatarLocalPath)
// const coverImage= await uploadOnCloudinary(coverImageLocalPath)

//since avatar is compulsory therefore below code
// if (!avatar) {
//     throw new ApiError(400, "Avatar file is required")
// }

// below code for 6
//since database in different continent it takes time to send data to it and we may also get error.for error we have asyncHandler which will catch the error. but for time it will take we use await 
const user =await User.create({ // since connecting with database takes time therefore await used
    fullName, 
    // avatar:avatar.url,
    // coverImage: coverImage?.url || "",//in above code no problem since we will have avatar.url or else we have thrown an error up since avatar is compulsory
    // but coverImage is not compulsory therefore its possible that its url not there therfore above code using optional chaining . if url there then ok or else assign ""(emptu string)
    email,
    password,
    username:username.toLowerCase()// since we want to save username in lowercase in db 

})

// code for 7 & 8
const createdUser=await User.findById(user._id).select("-password -refreshToken")// it takes time therefore await.
// here first search by id and if its exist then remove password and refreshtoken for that user here in select() we use '-' with these names because by default all are selected hence - means we want to remove these  2 data
 if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
 }

// below code for 9 we dont wantany random response to go but rather proper Api response to go therefore we use ApiResponse.js file in utils folder by importing {ApiResponse } 
// here we send json response
return res.status(201)  
// res.status(201): Sets the HTTP status code of the response to 201.
// 201 Created is the standard response for successful creation of a resource (e.g., a new user).
.json(
   new ApiResponse(200, createdUser, "User registered successfully") // we created new api resonspse object
//    status code =200  , data =createdUser and message ="User...successfully"
)
// .json(): This method sends a JSON response. The argument to json() is the data that will be sent as the
//  response body.

})

// logging in user
const loginUser= asyncHandler(async(req,res)=>{
   
    const {email,username,password}=req.body;
    if(!(username || email)){
        throw new ApiError(400, "username or email required")
    }

    
    const user= await User.findOne({ 
        $or:[{username}, {email}] 
    })
    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    
   const isPasswordValid =await user.isPasswordCorrect(password)



   if(!isPasswordValid){
    throw new ApiError(401 ,"Invalid user credentials" )
   }


const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)



const loggedInUser= await User.findById(user._id).select("-password -refreshToken") 

 

const options={
    httpOnly:true,
    secure:true
 } 



 return res
 .status(200)
 .cookie("accessToken", accessToken,options)
 .cookie("refreshToken",refreshToken,options)

 .json(
    new ApiResponse(
        200, 
        {user:loggedInUser,accessToken,refreshToken},
        "User logged In Successfully"
    )
 )
})

//logging out user
const logoutUser= asyncHandler(async(req,res)=>{
    
    await User.findByIdAndUpdate(req.user._id, { 
        $unset:{
            refreshToken:1 
        }
    },
    {new : true} 
)



const options={
    httpOnly:true,
    secure:true
 } 

return res.status(200)
.clearCookie("accessToken", options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200, {}, "User logged out"))

})


const refreshAccessToken= asyncHandler(async(req,res)=>{
    
    const incomingRefreshToken= req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request")
    }
    
    try {
        const decodedToken= jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        
    
    
        
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401 , "Refresh token is expired or used")
        }
        const options={
            httpOnly:true,
            secure:true
        }
        const {accessToken, newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accesToken",accessToken,options)
        .cookie("refreshToken", newrefreshToken,options)
        .json(
            new ApiResponse(
                200, {accessToken,refreshToken:newrefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token" )
    }

})

// to change current password
const changeCurrentPassword =asyncHandler(async(req,res)=>{
    const {oldPassword , newPassword }=req.body

    const user = await User.findById(req.user?._id)
   const isPasswordCorrect=await user.isPasswordCorrect(oldPassword) 
   if(!isPasswordCorrect){
    throw new ApiError(400, "Invalid old password")
       }
       user.password = newPassword
       await user.save({validateBeforeSave:false})
       
       return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getCurrentUser= asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200 , req.user , "Current user fetched successfully"))
})


const updateAccountDetails= asyncHandler(async(req,res)=>{
    const {fullName, email}= req.body
    if(!fullName || !email){
        throw new ApiError(400 , "All fields are required")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id, 
        {
            $set :{ 
                fullName:fullName,
                
                email:email
                
             } 
        } , 
        {new :true}
       
        ).select("-password")
        


        return res
        .status(200)
        .json(new ApiResponse(200, user , "Account details updated successfully"))
})

// const updateUserAvatar = asyncHandler(async(req,res)=>{
//     const avatarLocalPath=req.file?.path // earlier while uplooadin we used files because we were allowing multiople files upload but here only file since no need of more than 1 file here
//     if(!avatarLocalPath){
//         throw new ApiError(400 , "Avatar file is missing")
//     }


//     // todo : delete old image - assignment-> create utility func and use it after image is avatar is updated to delete old image
//     const avatar = await uploadOnCloudinary(avatarLocalPath)
//     if(!avatar.url){
//         throw new ApiError(400 , "Error while uploading on avatar")

//     }
//  const user = await User.findByIdAndUpdate(
//     req.user?._id, 
//     {
//         $set:{
//             avatar:avatar.url
//             // sets the avatar in db[lhs] from avater.url recieved from req.body[rhs]
//         }
//     }, {new:true}
//  ).select("-password")

//  return res
//  .status(200)
//  .json(
//     new ApiResponse(200, user , "avatar updated successfully")
//  )
// })

// const updateUserCoverImage = asyncHandler(async(req,res)=>{
//     const coverImageLocalPath=req.file?.path // earlier while uplooadin we used files because we were allowing multiople files upload but here only file since no need of more than 1 file here
//     if(!coverImageLocalPath){
//         throw new ApiError(400 , "Cover image file is missing")
//     }

//     const coverImage = await uploadOnCloudinary(coverImageLocalPath)
//     if(!coverImage.url){
//         throw new ApiError(400 , "Error while uploading coverImage")

//     }
//  const user=await User.findByIdAndUpdate(
//     req.user?._id, 
//     {
//         $set:{
//             coverImage:coverImage.url
//         }
//     }, {new:true}
//  ).select("-password")

//  return res
//  .status(200)
//  .json(
//     new ApiResponse(200, user , "cover image updated successfully")
//  )
// })








export {
    registerUser,
     loginUser, 
     logoutUser ,
      refreshAccessToken,
    changeCurrentPassword,
getCurrentUser,
updateAccountDetails,
// updateUserAvatar,
// updateUserCoverImage,

}