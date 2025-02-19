
const RoleLog = require("../../models/roles/RoleLogs");

const getRoleLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     
      const logs = await RoleLog.find({company})
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getRoleLogs