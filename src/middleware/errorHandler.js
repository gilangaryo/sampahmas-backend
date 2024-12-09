class CustomError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
}

const ErrorHandler = (err, req, res, next) => {
    // Default values for error handling
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Prepare error response object
    const errorResponse = {
        success: false,
        status: statusCode,
        message: message,
    };

    // Include stack trace only in development mode
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Log the error for debugging
    console.error(`[ERROR] ${message} (Status: ${statusCode})`, process.env.NODE_ENV === 'development' ? err.stack : '');

    // Send the error response
    res.status(statusCode).json(errorResponse);
};

export { CustomError, ErrorHandler };
