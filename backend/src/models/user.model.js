import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
            index: true
        },
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        profilePhoto: {
            type: String // cloudinary public url
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String
        }
    },
    { timestamps: true }
)

// run this function first everytime before saving a user (hash its password)
UserSchema.pre("save", async function () { // pre - hook (auto run)
    if (!this.isModified("password")) return // do not hash and return if the pass is not modified or new

    this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            username: this.username,
            email: this.email
        },
        process.env.ACCESSTOKEN_SECRET,
        {
            expiresIn: process.env.ACCESSTOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESHTOKEN_SECRET,
        {
            expiresIn: process.env.REFRESHTOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema) // mongodb will create 'users' collection for 'User'