// class ApiError extends Error {
//   constructor(message, status) {
//     super(message);
//     this.status = status;
//     this.data = null;
//     this.success = false;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

// export default ApiError;


class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

export { ApiError };