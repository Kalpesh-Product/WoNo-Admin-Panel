const Company = require("../../models/Company");
const mongoose = require("mongoose");
const { createLog } = require("../../utils/moduleLogs");

const addLeaveType = async (req, res, next) => {
  const { leaveType } = req.body;
   const path = "CompanyLogs";
  const action = "Add Leave Type";
  const { user, ip, company } = req;

  try {
    if (!company || !leaveType) {
      await createLog(path, action, "All fields are required", "Failed", user, ip, company);
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      await createLog(path, action, "Invalid company provided", "Failed", user, ip, company);
      return res.status(400).json({
        message: "Invalid company provided",
      });
    }

    const updateLeaveType = await Company.findByIdAndUpdate(
      { _id: company },
      {
        $push: {
          leaveTypes: {
            name: leaveType,
          },
        },
      }
    );

    if (!updateLeaveType) {
      await createLog(path, action, "Couldn't add leave type", "Failed", user, ip, company);
      return res.status(400).json({
        message: "Couldn't add leave type",
      });
    }

    // Success log
    await createLog(path, action, "Leave type added successfully", "Success", user, ip, company, 
      updateLeaveType._id,
      { leaveType },
    );

    return res.status(200).json({
      message: "Leave type added successfully",
    });
  } catch (error) {
    next(error);
  }
};


  module.exports = {addLeaveType}