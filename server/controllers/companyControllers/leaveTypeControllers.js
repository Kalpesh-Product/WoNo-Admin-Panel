const Company = require("../../models/Company");
const mongoose = require("mongoose");

const addLeaveType = async (req, res, next) => {

    const {leaveType} = req.body
    const companyId = req.userData.company
    try {
  
      if(!companyId || !leaveType){
        return res.status(400).json({
          message: "All feilds are required",
        });
      }
  
      if(!mongoose.Types.ObjectId.isValid(companyId)){
        return res.status(400).json({
          message: "Invalid companyId provided",
        });
      }
  
      const updateLeaveType = await Company.findByIdAndUpdate({_id:companyId},{$push: {
        leaveTypes:{
          name:leaveType
        }
      }});
  
      if(!updateLeaveType){
        return res.status(400).json({
          message: "Couldn't add leave type",
        });
      }
  
      return res.status(200).json({
        message: "Leave type added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  module.exports = {addLeaveType}