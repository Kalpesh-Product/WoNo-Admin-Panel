

const AttendanceLog = require("../models/AttendanceLogs");

const getAttendanceLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     
      const logs = await AttendanceLog.find({company})
   
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getAttendanceLogs