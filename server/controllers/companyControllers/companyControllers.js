const sharp = require("sharp");
const mongoose = require("mongoose");
const { handleFileUpload } = require("../../config/cloudinaryConfig");
const Company = require("../../models/Company");

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
    res.status(200).json({
      message: "Company data fetched",
      companies,
    });
  } catch(error) { 
   next(error)
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
      res.status(400).json({
        message: "Company doesn't exists"
      });
    }

    res.status(201).json({
      message: "Logo added successfully"
    });
  } catch (error) {
    console.error("Error adding logo:", error);
    next(error);
  }
};

const addWorkLocation = async (req, res, next) => {

  const {companyId,workLocation} = req.body
  try {

    if(!companyId || !workLocation){
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await Company.findByIdAndUpdate({_id:companyId},{$push: {
      workLocation:{
        name:workLocation
      }
    }});

    res.status(200).json({
      message: "Work location added successfully",
    });
 
  } catch(error) { 
    next(error)
  }
}

const addLeaveType = async (req, res, next) => {

  const {companyId,leaveType} = req.body
  try {

    if(!companyId || !leaveType){
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await Company.findByIdAndUpdate({_id:companyId},{$push: {
      leaveType:{
        name:leaveType.toLowerCase()
      }
    }});
    res.status(200).json({
      message: "Leave type added successfully",
    });
 
  } catch(error) { 
    next(error)
  }
}

const addEmployeeType = async (req, res, next) => {

  const {companyId,employeeType} = req.body
  try {

    if(!companyId || !employeeType){
      res.status(400).json({
        message: "All feilds are required",
      });
    }

   const updateEmployeeType = await Company.findByIdAndUpdate({_id:companyId},{$push: {
      employeeType:{
        name:employeeType
      }
    }});

    if(!updateEmployeeType){
      res.status(400).json({
        message: "Company doesn't exists",
      });
    }

    res.status(200).json({
      message: "Employee type added successfully",
    });
 
  } catch(error) { 
    next(error)
  }
}

const addShift = async (req, res, next) => {

  const {companyId,shift} = req.body
  try {

    if(!companyId || !shift){
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await Company.findByIdAndUpdate({_id:companyId},{$push: {
      shift:{
        name:shift
      }
    }});
    res.status(200).json({
      message: "Shift added successfully",
    });
 
  } catch(error) { 
    next(error)
  }
}
 

const updateActiveStatus = async (req, res, next) => {

  const {status,employeeTypeName} = req.body
  const companyId = req.userData.company

  try {

    if(!employeeTypeName){
      res.status(400).json({
        message: "All feilds are required",
      });
    }
     
    if(typeof status != 'boolean'){
      res.status(400).json({
        message: "Status should be a boolean",
      });
    }

     if (!mongoose.Types.ObjectId.isValid(companyId)) {
          return res
            .status(400)
            .json({ message: "Invalid company ID provided" });
        }

        const updateStatus = await Company.findOneAndUpdate(
          { _id: companyId, "employeeType.name": employeeTypeName },
          { $set: { "employeeType.$.status": status } }, 
          { new: true } 
        );

    if(!updateStatus){
      res.status(400).json({
        message: "Company doesn't exists",
      });
    }

    res.status(200).json({
      message: "Status updated successfully",
    });
 
  } catch(error) { 
    next(error)
  }
}


module.exports = { addCompany,addCompanyLogo, getCompanies, addWorkLocation,addLeaveType,addEmployeeType,addShift,updateActiveStatus };
