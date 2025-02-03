const Company = require("../models/Company");


async function updateEmployeeTypeStatus (companyId,field,status){

    const updatedStatus = await Company.findOneAndUpdate(
      { _id: companyId, "employeeType.name": field },
      { $set: { "employeeType.$.status": status } }, 
      { new: true } 
    );
     return updatedStatus
  }

async function updateWorkLocationStatus (companyId,field,status){

    const updatedStatus = await Company.findOneAndUpdate(
      { _id: companyId, "workLocation.name": field },
      { $set: { "workLocation.$.status": status } }, 
      { new: true } 
    );
     return updatedStatus
  }

async function updateLeaveTypeStatus (companyId,field,status){

    const updatedStatus = await Company.findOneAndUpdate(
      { _id: companyId, "leaveType.name": field },
      { $set: { "leaveType.$.status": status } }, 
      { new: true } 
    );
     return updatedStatus
  }

  async function updateShiftStatus (companyId,field,status){

    const updatedStatus = await Company.findOneAndUpdate(
      { _id: companyId, "shift.name": field },
      { $set: { "shift.$.status": status } }, 
      { new: true } 
    );
     return updatedStatus
  }

  module.exports = {updateEmployeeTypeStatus,updateWorkLocationStatus,updateLeaveTypeStatus,updateShiftStatus}