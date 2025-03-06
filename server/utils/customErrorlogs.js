class CustomError extends Error {
  constructor(
    message,
    path = "",
    action = "",
    sourceKey = "",
    statusCode = 400
  ) {
    console.log("message", message);
    console.log("path", path);
    console.log("action", action);
    console.log("sourceKey", sourceKey);

    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.action = action;
    this.sourceKey = sourceKey;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
