const sharp = require("sharp");
const mongoose = require("mongoose");
const { handleFileUpload } = require("../../config/cloudinaryConfig");
const Company = require("../../models/Company");
const { updateWorkLocationStatus, updateEmployeeTypeStatus, updateShiftStatus, updateLeaveTypeStatus } = require("../../utils/companyUpdateStatus");

const addCompany = async (req, res, next) => {
  try {
    const {
      companyId,
      selectedDepartments,
      companyName,
      industry,
      companySize,
      companyCity,
      companyState,
      websiteURL,
      linkedinURL,
      employeeType,
    } = req.body;

    // Validate required fields
    if (
      !companyId ||
      !companyName ||
      !industry ||
      !companySize ||
      !companyCity ||
      !companyState
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new company instance
    const newCompany = new Company({
      companyId,
      selectedDepartments,
      companyName,
      industry,
      companySize,
      companyCity,
      companyState,
      websiteURL,
      linkedinURL,
      employeeType,
    });

    // Save the company to the database
    await newCompany.save();

    // Respond with success message
    return res.status(201).json({
      message: "Company added successfully",
      company: newCompany,
    });
  } catch (error) {
    // Pass the error to the next middleware
    // Pass the error to the next middleware
    next(error);
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    return res.status(200).json({
      message: "Company data fetched",
      companies,
    });
  } catch (error) {
    next(error);
  }
}


const addCompanyLogo = async (req, res, next) => {
  try {
    
    const {company} = req.userData
    
    let imageId;
    let imageUrl;

    if (req.file) {
      const file = req.file;

      const buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;
      const uploadResult = await handleFileUpload(base64Image, "Company-logos");

      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    const companyLogo = {
      logoId: imageId,
      logoUrl: imageUrl
    }
      
    const newCompanyLogo = await Company.findByIdAndUpdate({_id:company},{companyLogo},{new:true})

    if(!newCompanyLogo){
      return res.status(400).json({
        message: "Company doesn't exists"
      });
    }

    return res.status(201).json({
      message: "Logo added successfully"
    });
  } catch (error) {
    console.error("Error adding logo:", error);
    next(error);
  }
};

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
      workLocation:{
        name:workLocation
      }
    },new: true});
 
    if(!updateWorkLocation){
      return res.status(400).json({
        message: "Company doesn't exist",
      });
    }

    return res.status(200).json({
      message: "Work location added successfully",
    });
  } catch (error) {
    next(error);
  }
};

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

    await Company.findByIdAndUpdate({_id:companyId},{$push: {
      leaveType:{
        name:leaveType
      }
    }});
    return res.status(200).json({
      message: "Leave type added successfully",
    });
  } catch (error) {
    next(error);
  }
}

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
      employeeType:{
        name:employeeType
      }
    }});

    if(!updateEmployeeType){
      return res.status(400).json({
        message: "Company doesn't exists",
      });
    }

    return res.status(200).json({
      message: "Employee type added successfully",
    });
  } catch (error) {
    next(error);
  }
}

const addShift = async (req, res, next) => {
  try {
    const user = req.user;
    const { shiftName } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();

    if (!foundUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const company = await Company.findOne({ _id: foundUser.company })
      .lean()
      .exec();

    if (!company) {
      return res.status(400).json({ message: "No such company exists" });
    }

    await Company.findOneAndUpdate(
      { _id: foundUser.company },
      { $push: { shifts: shiftName } }
    ).exec();

    return res.status(200).json({ message: "work shift added successfully" });
  } catch (error) {
    next(error);
  }
}
 

const updateActiveStatus = async (req, res, next) => {

  const {status} = req.body
  const {field} = req.params
  const companyId = req.userData.company

  try {

    if(!field){
      return res.status(400).json({
        message: "All feilds are required",
      });
    }
     
    if(typeof status != 'boolean'){
      return res.status(400).json({
        message: "Status should be a boolean",
      });
    }

     if (!mongoose.Types.ObjectId.isValid(companyId)) {
          return res
            .status(400)
            .json({ message: "Invalid company ID provided" });
        }

    const updateHandlers = {
      workLocations: updateWorkLocationStatus,
      employeeTypes: updateEmployeeTypeStatus,
      shifts: updateShiftStatus,
      leaveTypes: updateLeaveTypeStatus
    }

    const updatedFunction = updateHandlers[field]

    const updatedStatus = await updatedFunction(companyId,field,status)

    if(!updatedStatus){
      return res.status(400).json({
        message: "Company doesn't exists",
      });
    }

    return res.status(200).json({
      message: "Status updated successfully",
    });
 
  } catch(error) { 
    next(error)
  }
}


module.exports = { addCompany,addCompanyLogo, getCompanies, addWorkLocation,addLeaveType,addEmployeeType,addShift,updateActiveStatus };
