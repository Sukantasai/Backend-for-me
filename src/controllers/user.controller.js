import {asyncHandler} from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async(_req, res)=> {
    return res.status(200).json({
        message:"Done upto"
    })
})

export {
    registerUser,
}