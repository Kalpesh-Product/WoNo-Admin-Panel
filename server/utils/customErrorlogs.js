class CustomError extends Error {
  constructor(message, statusCode, path, action, sourceKey) {
    super(message);
    this.statusCode = statusCode;
    this.path = path;
    this.action = action;
    this.sourceKey = sourceKey;
  }
}

module.exports = CustomError;
