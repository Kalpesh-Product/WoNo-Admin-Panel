// const errorHandler = (err, req, res, next) => {
//   (err.stack);
//   res.status(500).json({ message: err.message });
//   next();
// };

const { createLog } = require("../utils/moduleLogs");

const errorHandler = async (err, req, res, next) => {
  try {
    const { user, ip, company } = req;

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const path = err.path || req.originalUrl || "";
    const action = err.action || req.originalUrl || "Unknown API Error";
    const sourceKey = err.sourceKey || "";
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
      } catch (logError) {
        return res
          .status(500)
          .json({ message: "Logging failed", error: logError });
      }
    }

    return res.status(statusCode).json({ message, path });
  } catch (criticalError) {
    return res.status(500).json({
      message: "Critical error in error handler",
      error: criticalError,
    });
  }
};

module.exports = errorHandler;
