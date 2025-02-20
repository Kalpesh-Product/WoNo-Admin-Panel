
const Company = require("../../models/Company");
const mongoose = require("mongoose");

const addShift = async (req, res, next) => {
    try {
      const companyId = req.userData.company
      const { name } = req.body;
  
      if(!mongoose.Types.ObjectId.isValid(companyId)){
        return res.status(400).json({ message: "Invalid company Id provided" });
      }

      const company = await Company.findOne({ _id: companyId })
        .lean()
        .exec();
  
      if (!company) {
        return res.status(400).json({ message: "No such company exists" });
      }
  
      const updatedCompany = await Company.findOneAndUpdate(
        { _id: companyId},
        { $push: { shifts: name } }
      ).exec();
  
      if(!updatedCompany){
        return res.status(400).json({message:"Failed to add shifts"})
      }

      return res.status(200).json({ message: "Work shift added successfully" });
    } catch (error) {
      next(error);
    }
  }

  module.exports = {addShift}