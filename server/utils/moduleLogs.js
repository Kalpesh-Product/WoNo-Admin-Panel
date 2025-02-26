const addLog = async (path, data) => {
  const Model = require(`../models/${path}`);
  const doc = await Model.create(data);
  return doc;
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
