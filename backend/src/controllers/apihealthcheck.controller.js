import {asyncHandler} from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const apiHealthCheck = asyncHandler(async (_, res) => {
    res.status(200).json(
        new ApiResponse(200, {}, "Authentication API is healthy and running")
    )
})

export { apiHealthCheck }