import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js"

const cookieOptions = {
    httpOnly: true,
    secure: true
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    const { fullname, username, email, password } = req.body

    // validation - not empty
    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // check if user already exists: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const profilePhotoLocalPath = req.file?.path

    const user = await User.create({
        fullname,
        profilePhoto: profilePhotoLocalPath || "",
        username: username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    if (!await user.isPasswordCorrect(password)) {
        throw new ApiError(400, "Incorrect password")
    }

    const accessToken = await user.generateAccessToken()
    const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
        new ApiResponse(200, {
            user: loggedInUser,
            accessToken: accessToken,
            refreshToken: refreshToken
        }, "User logged in successfully")
        )
})

const logout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, `${req.user.username} logged out successfully`))
})

const getAUser = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is missing")
    }

    const user = await User.findOne({ username }).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    return res.status(200).json(
        new ApiResponse(200, user, "User fetched successfully")
    )
})

const updateAUser = asyncHandler(async (req, res) => {
    const { newFullname, newUsername } = req.body
    const { username } = req.params

    // Ensure the user is updating their own profile
    if (req.user.username !== username) {
        throw new ApiError(403, "You can only update your own account")
    }

    const updateFields = {}
    if (newFullname) updateFields.fullname = newFullname
    if (newUsername) updateFields.username = newUsername

    // If a new file is uploaded
    if (req.file?.path) {
        updateFields.profilePhoto = req.file.path
    }

    if (Object.keys(updateFields).length === 0) {
        throw new ApiError(400, "No fields to update")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: updateFields
        },
        { new: true }
    ).select("-password")

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Account details updated successfully")
    )

})

const deleteAUser = asyncHandler(async (req, res) => {
    const { username } = req.params

    if (req.user.username !== username) {
        throw new ApiError(403, "You can only delete your own account")
    }

    const deletedUser = await User.findOneAndDelete({ username }).select("-password -refreshToken")

    return res.status(200).json(
        new ApiResponse(200, deletedUser, "User deleted successfully")
    )
})

export { registerUser, loginUser, getAUser, updateAUser, deleteAUser, logout }