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
    console.error("Error processing company data:", error);
    next(error);
  }
};

const getCompanies = async (req, res, nex) => {
  try {
    const companies = await CompanyData.find();
    res.status(200).json({
      message: "Company data fetched",
      companies
    });
  } catch(error) { 
    console.error("Error fetching companies : ", error.message);
    res.status(500).json({error: error.message});
  }
}

module.exports = { addCompany, getCompanies };
