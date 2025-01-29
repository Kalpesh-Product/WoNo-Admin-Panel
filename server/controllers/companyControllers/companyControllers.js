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
    next(error);
  }
};

const getCompanies = async (req, res, next) => {
  try {
    const companies = await CompanyData.find();
    res.status(200).json({
      message: "Company data fetched",
      companies,
    });
  } catch (error) {
    console.error("Error fetching companies : ", error.message);
    next(error);
  }
};

module.exports = { addCompany, getCompanies };
