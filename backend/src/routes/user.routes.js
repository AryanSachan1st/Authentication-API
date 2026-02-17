import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { registerUser, loginUser, logout, getAUser, updateAUser, deleteAUser } from "../controllers/user.controller.js";

const userRouter = Router()

// set up middlewares (verifyJWT and multer)

/*
Note: Use form-data only when the route is using multer middleware to send text or non-text files or both.
*/

userRouter.route("/signup").post(upload.single("profilePhoto"), registerUser)
userRouter.route("/:username").get(getAUser).patch(verifyJWT, upload.single("profilePhoto"), updateAUser).delete(verifyJWT, deleteAUser)
userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(verifyJWT, logout)

export { userRouter }