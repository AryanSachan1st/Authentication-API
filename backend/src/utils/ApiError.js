class ApiError extends Error {
    constructor (
        code,
        message = "Something went wrong, please try after some time",
        errors = [],
        data = null,
        stack = ""
    ) {
        super(message)
        this.errorMessage = errorMessage
        stack = Error.captureStackTrace(this, this.constructor)
        this.errors = errors
        this.code = code
    }
}

export { ApiError }