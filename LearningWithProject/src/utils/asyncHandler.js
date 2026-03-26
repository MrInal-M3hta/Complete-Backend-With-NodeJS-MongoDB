const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(error => next(error));
};
/*
How asyncHandler Works in controllers ?

  🔹Step 1:
      You pass your controller:
        asyncHandler(async (req, res) => {...})

  🔹Step 2:
      It wraps your function:
        (req, res, next) => { ... }

  🔹Step 3:
      Promise.resolve(fn(req, res, next))
      👉 Executes your async function safely.

  🔹Step 4:
      .catch(error => next(error))
      👉 If any error occurs:
	      •	It catches it
	      •	Sends it to Express error middleware
*/
const asyncHandlerWithError = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};


export { asyncHandler, asyncHandlerWithError };