const addLog = async (path, data) => {
  const Model = require(`../models/${path}`);
  await Model.create(data);
};

const createLog = async ({
  path,
  action,
  remarks = "",
  status = "Failed",
  user,
  ip,
  company,
  sourceKey,
  sourceId,
  changes = null,
}) => {
  console.log("sourceKey", sourceKey);
  console.log("sourceId", sourceId);
  console.log("status", status);
  await addLog(path, {
    [sourceKey]: sourceId,
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
