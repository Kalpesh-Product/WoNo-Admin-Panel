
const RoomLog = require("../../models/meetings/RoomLogs");

const getRoomLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     
      const logs = await RoomLog.find({company})
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getRoomLogs