
const Company = require("../../models/Company");
const mongoose = require("mongoose");
const { createLog } = require("../../utils/moduleLogs");

const addWorkLocation = async (req, res, next) => {
  const path = "CompanyLogs";
  const action = "Add Work Location";
  const { user, ip, company } = req;
  const { workLocation } = req.body;
 
  try {
    if (!company || !workLocation) {
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

    const updateWorkLocation = await Company.findByIdAndUpdate(
      { _id: company },
      { $push: { workLocations: { name: workLocation } } },
      { new: true }
    );

    if (!updateWorkLocation) {
      await createLog(path, action, "Couldn't add work location", "Failed", user, ip, company);
      return res.status(400).json({
        message: "Couldn't add work location",
      });
    }

    // Success log with direct object instead of "data"
    await createLog(path, action, "Work location added successfully", "Success", user, ip, company, 
      updateWorkLocation._id,
      {workLocation: workLocation},
    );

    return res.status(200).json({
      message: "Work location added successfully",
    });
  } catch (error) {
    next(error);
  }
};


  module.exports = {addWorkLocation}