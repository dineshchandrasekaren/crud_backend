const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If error is not an instance of ApiError, create a new one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  console.error(response);

  return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
