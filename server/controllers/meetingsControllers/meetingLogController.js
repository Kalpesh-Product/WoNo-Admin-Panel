


const MeetingLog = require("../../models/meetings/MeetingLogs");

const getMeetingLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     

      const logs = await MeetingLog.find({company})
   
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getMeetingLogs