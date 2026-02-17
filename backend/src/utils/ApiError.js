class ApiError extends Error {
    constructor (
        statusCode,
        errorMessage = "Something went wrong, please try after some time",
        errors = [],
        data = null,
        stack = ""
    ) {
        super(errorMessage)
        this.errorMessage = errorMessage
        stack = Error.captureStackTrace(this, this.constructor)
        this.errors = errors
        this.statusCode = statusCode
    }
}

export { ApiError }