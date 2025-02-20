
const ReviewLog = require("../../models/meetings/ReviewLogs");

const getReviewLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     

      const logs = await ReviewLog.find({company})
   
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getReviewLogs