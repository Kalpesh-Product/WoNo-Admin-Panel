// const errorHandler = (err, req, res, next) => {
//   (err.stack);
//   res.status(500).json({ message: err.message });
//   next();
// };

const { createLog } = require("../utils/moduleLogs");

const errorHandler = async (err, req, res, next) => {
  err.stack;

  const { user, ip, company } = req;

  const statusCode = err.statusCode || 400;
  const message = err.message || "Internal Server Error";

  const path = err.path || "system/ErrorLogs";
  const action = err.action || req.originalUrl || "Unknown API Error";
  const sourceKey = err.sourceKey || "sourceKey";
  const sourceId = null;
  const remarks = err.message;

  if (req.method !== "GET") {
    try {
      await createLog({
        path,
        action,
        remarks,
        user,
        ip,
        company,
        sourceKey,
        sourceId,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Add logs to the controller", error });
    }
  }

  res.status(statusCode).json({ message });
  next();
};

module.exports = errorHandler;
