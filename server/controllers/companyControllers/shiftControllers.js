
const Company = require("../../models/Company");
const mongoose = require("mongoose");

const addShift = async (req, res, next) => {
  const path = "CompanyLogs";
  const action = "Add Shift";
  const { user, ip, company } = req;
  const { name } = req.body;
 
  try {
    if (!mongoose.Types.ObjectId.isValid(company)) {
      await createLog(path, action, "Invalid company Id provided", "Failed", user, ip, company);
      return res.status(400).json({ message: "Invalid company Id provided" });
    }

    const foundCompany = await Company.findOne({ _id: company }).lean().exec();

    if (!foundCompany) {
      await createLog(path, action, "No such company exists", "Failed", user, ip, company);
      return res.status(400).json({ message: "No such company exists" });
    }

    const updatedCompany = await Company.findOneAndUpdate(
      { _id: company },
      { $push: { shifts: name } }
    ).exec();

    if (!updatedCompany) {
      await createLog(path, action, "Failed to add shifts", "Failed", user, ip, company);
      return res.status(400).json({ message: "Failed to add shifts" });
    }

    // Success log
    await createLog(path, action, "Work shift added successfully", "Success", user, ip, company, 
      updatedCompany,
      { shift: name },
    );

    return res.status(200).json({ message: "Work shift added successfully" });
  } catch (error) {
    next(error);
  }
};


  module.exports = {addShift}