import express from "express"
import cookieParser  from "cookie-parser"

const app = express()
export { app }

// middlewares
app.use(express.json(
    {limit: "16kb"}
))
app.use(express.urlencoded(
    {
        extended: true,
        limit: "16kb"
    }
))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import { healthRouter } from "./routes/apihealthcheck.routes.js"
app.use("/", healthRouter)

import { userRouter } from "./routes/user.routes.js"
app.use("/users", userRouter)

// global error handler
app.use((err, req, res, next) => {
    console.error(err); // Log error to console for debugging
    let errorCode = err.code || 500
    let errorMessage = err.message || "Internal Server Error"

    if (err.name === "CastError") {
        errorCode = 400,
        errorMessage = "Resource not found, Invalid id"
    } else if (errorCode === 11000) {
        errorCode = 409,
        errorMessage = "Duplicate field value entered"
    } else if (err.name === "ValidationError") {
        errorCode = 400,
        errorMessage = Object.values(err.errors || {}).map((error) => error.errorMessage).join(", ")
    }

    return res.status(errorCode).json(
        {
            success: false,
            statusCode: errorCode,
            errorMessage: errorMessage,
            errors: err.errors || [],
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined
        }
    )
})