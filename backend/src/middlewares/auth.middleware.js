import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req, _, next) => {
    // TODO: fetch user through access token -> attach that user to req and forward the req to next middleware or controller

    const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if (!accessToken) {
        throw new ApiError(400, "Unauthorized request")
    }

    const decodedToken = jwt.verify(accessToken, process.env.ACCESSTOKEN_SECRET)

    if (!decodedToken) {
        throw new ApiError(400, "Invalid access token")
    }

    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new ApiError(404, "User does not exists")
    }

    req.user = user
    next()
})

export { verifyJWT }