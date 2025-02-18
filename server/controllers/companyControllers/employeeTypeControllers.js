const Company = require("../../models/Company");
const mongoose = require("mongoose");
const { createLog } = require("../../utils/moduleLogs");

const addEmployeeType = async (req, res, next) => {
  const { employeeType } = req.body;
  const path = "CompanyLogs";
  const action = "Add Employee Type";
  const { user, ip, company } = req;

  try {
    // First check: Missing fields
    if (!company || !employeeType) {
      await createLog(path, action, "Missing fields (company or employeeType)", "Failed", user, ip, company);
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Second check: Invalid company ID
    if (!mongoose.Types.ObjectId.isValid(company)) {
      await createLog(path, action, "Invalid company provided", "Failed", user, ip, company);
      return res.status(400).json({
        message: "Invalid company provided",
      });
    }

    // Update the employee type
    const updateEmployeeType = await Company.findByIdAndUpdate(
      { _id: company },
      {
        $push: {
          employeeTypes: {
            name: employeeType,
          },
        },
      },
      { new: true }
    );

    // Third check: Could not update the employee type
    if (!updateEmployeeType) {
      await createLog(path, action, "Couldn't add employee type", "Failed", user, ip, company);
      return res.status(400).json({
        message: "Couldn't add employee type",
      });
    }

    // Log success
    await createLog(path, action, "Employee type added successfully", "Success", user, ip, company,updateEmployeeType._id,{employeeType});

    return res.status(200).json({
      message: "Employee type added successfully",
    });
  } catch (error) {
    console.error("Error adding employee type:", error);
    next(error);
  }
};




  module.exports = {addEmployeeType}