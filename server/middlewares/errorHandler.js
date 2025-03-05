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

 return res.status(500).json(err)
};

module.exports = errorHandler;
