
const TicketLog = require("../../models/tickets/TicketLogs");

const getTicketLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     
      const logs = await TicketLog.find({company})
    
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getTicketLogs