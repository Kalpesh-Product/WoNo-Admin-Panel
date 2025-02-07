
const Company = require("../../models/Company");
const mongoose = require("mongoose");

const addWorkLocation = async (req, res, next) => {

    const {workLocation} = req.body
    const companyId = req.userData.company
  
    try {
  
      if(!companyId || !workLocation){
        return res.status(400).json({
          message: "All feilds are required",
        });
      }
  
      if(!mongoose.Types.ObjectId.isValid(companyId)){
        return res.status(400).json({
          message: "Invalid companyId provided",
        });
      }
  
      const updateWorkLocation = await Company.findByIdAndUpdate({_id:companyId},{$push: {
        workLocations:{
          name:workLocation
        }
      },new: true});
   
      if(!updateWorkLocation){
        return res.status(400).json({
          message: "Couldn't add work location",
        });
      }
  console.log(updateWorkLocation)
      return res.status(200).json({
        message: "Work location added successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  module.exports = {addWorkLocation}