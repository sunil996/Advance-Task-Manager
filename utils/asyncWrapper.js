
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}

module.exports=asyncHandler;
/*
const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // Pass the error to the next middleware for central handling
      next(error);
    }
  };
};

// ... define your routes

const getTask = asyncWrapper(async (req, res) => {
  const id = req.params.id;

  try {
    const task = await Task.find({ _id: id });

    if (!task) {
      return res.status(404).json({ msg: `No task with id: ${id}` });
    }

    res.status(200).json({ task });
  } catch (error) {
    // Handle the error specifically if needed here
    next(error); // Pass the error to the next middleware
  }
});

// Define app-level error handling middleware
app.use((err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // Determine appropriate response based on error type and HTTP status code
  let statusCode = 500; // Default to 500 Internal Server Error
  let message = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request for validation errors
    message = err.message;
  } else if (err.message.includes('No task with id')) {
    statusCode = 404; // Not Found for specific error messages
    message = 'Task not found';
  }

  res.status(statusCode).json({ error: message });
});


// app-level middleware

app.use((err, req, res, next) => {
    console.error(err.stack); // Log for debugging
    res.status(err.status || 500).json({ error: err.message }); // Send informative error response
});
*/