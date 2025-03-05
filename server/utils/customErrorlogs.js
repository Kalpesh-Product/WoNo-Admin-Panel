class CustomError extends Error {
  constructor(
    message,
    statusCode = 400,
    path = "",
    action = "",
    sourceKey = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.action = action;
    this.sourceKey = sourceKey;
  }
}

module.exports = CustomError;
