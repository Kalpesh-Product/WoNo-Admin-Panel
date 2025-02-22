
const AssetLog = require("../../models/assets/AssetLog");

const getAssetLogs = async (req, res, next) => {
     const company = req.company
   
    try {
     

      const logs = await AssetLog.find({company})
   
  
      return res.status(200).json(logs);
    } catch (error) {
      next(error);
    }
  };


  module.exports = getAssetLogs