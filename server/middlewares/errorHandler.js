// const errorHandler = (err, req, res, next) => {
//   (err.stack);
//   res.status(500).json({ message: err.message });
//   next();
// };

const { createLog } = require("../utils/moduleLogs");

// const errorHandler = async (err, req, res) => {
//   try {
//     const { user, ip, company } = req;

//     const statusCode = err.statusCode || 500;
//     const message = err.message || "Internal Server Error";
//     const path = err.path || req.originalUrl || "";
//     const action = err.action || req.originalUrl || "Unknown API Error";
//     const sourceKey = err.sourceKey || "";
//     const sourceId = null;
//     const remarks = err.message;

//     console.log("statusCode", statusCode);
//     if (req.method !== "GET") {
//       try {
//         await createLog({
//           path,
//           action,
//           remarks,
//           user,
//           ip,
//           company,
//           sourceKey,
//           sourceId,
//         });
//       } catch (logError) {
//         return res
//           .status(500)
//           .json({ message: "Logging failed", error: logError });
//       }
//     }

//     return res.status(statusCode).json({ message, path });
//   } catch (criticalError) {
//     return res.status(500).json({
//       message: "Critical error in error handler",
//       error: criticalError,
//     });
//   }
// };

const errorHandler = async (err, req, res, next) => {
  try {
    console.log("🔴 ErrorHandler called"); // Confirm it's triggered
    console.error("🔴 Error:", err); // Log full error

    const { user, ip, company } = req;
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const path = err.path || req.originalUrl || "system/ErrorLogs";
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
      } catch (logError) {
        console.error("🔴 Logging Error in errorHandler:", logError);
        return res
          .status(500)
          .json({ message: "Logging failed", error: logError });
      }
    }

    return res.status(statusCode).json({ message });
  } catch (criticalError) {
    console.error("🔴 CRITICAL ERROR in errorHandler:", criticalError);
    return res.status(500).json({
      message: "Critical error in error handler",
      error: criticalError,
    });
  }
};

module.exports = errorHandler;
