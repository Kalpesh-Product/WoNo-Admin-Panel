
const EventLog = require("../../models/EventLogs");

const getEventLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     
      const logs = await EventLog.find({company})
   
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getEventLogs