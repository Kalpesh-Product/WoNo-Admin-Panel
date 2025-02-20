const Company = require("../../models/Company");
const mongoose = require("mongoose");

const addEmployeeType = async (req, res, next) => {

    const {employeeType} = req.body
    const companyId = req.userData.company
    try {
  
      if(!companyId || !employeeType){
        return res.status(400).json({
          message: "All feilds are required",
        });
      }
  
      if(!mongoose.Types.ObjectId.isValid(companyId)){
        return res.status(400).json({
          message: "Invalid companyId provided",
        });
      }
  
     const updateEmployeeType = await Company.findByIdAndUpdate({_id:companyId},{$push: {
        employeeTypes:{
          name:employeeType
        }
      },},{new: true});
  
      if(!updateEmployeeType){
        return res.status(400).json({
          message: "Couldn't add employee type",
        });
      }
  
      return res.status(200).json({
        message: "Employee type added successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  module.exports = {addEmployeeType}