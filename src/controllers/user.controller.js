import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponce.js";

const registerUser = asyncHandler(async(req, res)=> {
    // get user details from fontend
    // validation - not empty
    // check if user is already exists:username, email
    // check for images, check for avatar
    // upload them to cloudnary, avatar 
    // create user object - create entry in db
    // remove password and refresh token field from responce
    // check for user creation
    // return response



    // extract all the datapoint from the body


    const {fullname, email, username, password} = req.body
    // console.log("email: ", email);
    // console.log(req.body);
    

    // check all the points is not empty?


    // if(fullname === ""){
    //     throw new ApiError(400,"fullname is required")
    // }
    // write for all the component eg. email, username,password

    if (
        [fullname, email, username, password].some((field) =>
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }



    // check username and emnil are already exists or not?
    
    const existedUser = await User.findOne({
        $or: [{ username } , { email }]
    })
    // console.log("existedUser: ", existedUser);

    // if already exists send the error
    
    if (existedUser){
        throw new ApiError(409, "User with email or username exists")
    }
    // console.log(req.files);
    

    const avatarLocalPath=  req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.file?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage)&& req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }




    // console.log(req.file);
    

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is require")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = uploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400, "Avatar file is require")
    }

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()

    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError (500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered sucessesfully")
    )

})

export {
    registerUser,
}