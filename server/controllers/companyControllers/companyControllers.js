const CompanyData = require("../../models/CompanyData");

const addCompany = async (req, res, next) => {
  try {
    // Extract the data from the wono registration form
    const formData = req.body;

    // Step 1: Save the companyInfo to the CompanyData table
    const companyInfoData = formData.companyInfo;
    const savedCompanyData = await new CompanyData(companyInfoData).save();

    // Step 2: Save the Company with a reference to CompanyData
    const companyData = {
      companyId: formData._id, // Use the provided _id as the companyId
      companyInfo: savedCompanyData._id, // Reference the CompanyData document
    };
    const savedCompany = await new Company(companyData).save();

    res.status(201).json({
      message: "Company and CompanyInfo added successfully",
      company: savedCompany,
    });
  } catch (error) {
    next(error);
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyData.find();
    res.status(200).json({
      message: "Company data fetched",
      companies
    });
  } catch(error) { 
   next(error)
  }
}

const addWorkLocation = async (req, res, next) => {

  const {companyId,workLocation} = req.body
  try {

    if(!companyId || !workLocation){
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await CompanyData.findOneAndUpdate({_id:companyId},{$push: {
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

    await CompanyData.findOneAndUpdate({_id:companyId},{$push: {
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
      res.status(200).json({
        message: "All feilds are required",
      });
    }

    await CompanyData.findOneAndUpdate({_id:companyId},{$push: {
      employeeType:{
        name:employeeType.toLowerCase()
      }
    }});
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

    await CompanyData.findOneAndUpdate({_id:companyId},{$push: {
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
 

module.exports = { addCompany, getCompanies, addWorkLocation,addLeaveType,addEmployeeType,addShift };
