

const CompanyLog = require("../../models/CompanyLogs");

const getCompanyLogs = async (req, res, next) => {
     const company = req.company
   
    try {

      const logs = await CompanyLog.find({company})
   
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getCompanyLogs