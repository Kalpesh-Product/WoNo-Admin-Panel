const sharp = require("sharp");
const mongoose = require("mongoose");
const { handleFileUpload } = require("../../config/cloudinaryConfig");
const Company = require("../../models/Company");
const {
  updateWorkLocationStatus,
  updateShiftStatus,
  updateLeaveTypeStatus,
  UpdateEmployeeTypeStatus,
} = require("../../utils/companyData");

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
};

const addCompanyLogo = async (req, res, next) => {
  try {
    const { company } = req.userData;

    let imageId;
    let imageUrl;

    if (req.file) {
      const file = req.file;

      const buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "contain" })
        .webp({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;
      const uploadResult = await handleFileUpload(base64Image, "Company-logos");

      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    const companyLogo = {
      logoId: imageId,
      logoUrl: imageUrl,
    };

    const newCompanyLogo = await Company.findByIdAndUpdate(
      { _id: company },
      { companyLogo },
      { new: true }
    );

    if (!newCompanyLogo) {
      return res.status(400).json({
        message: "Couldn't add company logo",
      });
    }

    return res.status(201).json({
      message: "Logo added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getCompanyLogo = async (req, res, next) => {
  try {
    const companyId = req.userData.company;

    const company = await Company.findById({ _id: companyId }).select(
      "companyLogo"
    );

    if (!company) {
      return res.status(400).json({ message: "Couldn't fetch company logo" });
    }

    return res.status(200).json(company.companyLogo);
  } catch (error) {
    next(error);
  }
};

const getCompanyData = async (req, res, next) => {
  const { field } = req.query; // employeeTypes | workLocations | leaveTypes | shifts
  const companyId = req.userData.company;

  try {
    if (!field) {
      return res.status(400).json({
        message: "All feilds are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID provided" });
    }

    const fetchedData = await Company.findOne({ _id: companyId })
      .select(`${field}`)
      .populate(field);

    if (!fetchedData) {
      return res.status(400).json({
        message: "Couldn't fetch the data",
      });
    }

    return res.status(200).json(fetchedData);
  } catch (error) {
    next(error);
  }
};

const updateActiveStatus = async (req, res, next) => {
  const { status, name } = req.body;
  const { field } = req.params;
  const companyId = req.userData.company;

  try {
    if (!field) {
      return res.status(400).json({
        message: "All feilds are required",
      });
    }

    if (typeof status != "boolean") {
      return res.status(400).json({
        message: "Status should be a boolean",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID provided" });
    }

    const updateHandlers = {
      workLocations: updateWorkLocationStatus,
      employeeTypes: UpdateEmployeeTypeStatus,
      shifts: updateShiftStatus,
      leaveTypes: updateLeaveTypeStatus,
    };

    const updatedFunction = updateHandlers[field];

    const updatedStatus = await updatedFunction(companyId, name, status);

    if (!updatedStatus) {
      return res.status(400).json({
        message: "Couldn't update status",
      });
    }

    return res.status(200).json({
      message: "Status updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCompany,
  addCompanyLogo,
  getCompanies,
  updateActiveStatus,
  getCompanyData,
  getCompanyLogo,
};
