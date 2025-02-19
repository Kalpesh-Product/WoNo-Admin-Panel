// logService.js
const addLog = async (path, data) => {
    const Model = require(`../models/${path}`);
    await Model.create(data);
  };
  
  const createLog = async (path, action, remarks = '',status = "Failed", user, ip,company, id=null, changes = null) => {
  
    await addLog(path, {
      sourceId:id,
      action,
      remarks,
      status,
      changes,
      performedBy: user,
      ipAddress: ip,
      company: company,
    });
  };

 
  
  module.exports = { addLog, createLog };
  