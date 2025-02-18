

const LeaveLog = require("../../models/LeaveLogs");

const getLeaveLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     
      const logs = await LeaveLog.find({company})
   
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getLeaveLogs