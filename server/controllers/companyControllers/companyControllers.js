const sharp = require("sharp");
const mongoose = require("mongoose");
const { handleFileUpload } = require("../../config/cloudinaryConfig");
const Company = require("../../models/hr/Company");
const {
  updateWorkLocationStatus,
  updateShiftStatus,
  updateLeaveTypeStatus,
  UpdateEmployeeTypeStatus,
} = require("../../utils/companyData");
const { createLog } = require("../../utils/moduleLogs");

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

    const { user } = req;
    const company = req.company;
    const ip = req.ip;
    let path = "CompanyLogs";
    let action = "Add Company";

    // Validate required fields
    if (
      !companyId ||
      !companyName ||
      !industry ||
      !companySize ||
      !companyCity ||
      !companyState
    ) {
      await createLog(
        path,
        action,
        "Missing required fields",
        "Failed",
        user,
        ip,
        company
      );
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

    // Log the successful creation of a company
    await createLog(
      path,
      action,
      "Company added successfully",
      "Success",
      user,
      ip,
      company,
      newCompany._id,
      {
        companyName,
        industry,
        companySize,
        companyCity,
        companyState,
        websiteURL,
        linkedinURL,
        employeeType,
      }
    );

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
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (error) {
    next(error);
  }
};

const addCompanyLogo = async (req, res, next) => {
  try {
    const { company } = req.userData;
    const { user } = req;
    const ip = req.ip;
    let path = "CompanyLogs";
    let action = "Add Company Logo";

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
      await createLog(
        path,
        action,
        "Couldn't add company logo",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({
        message: "Couldn't add company logo",
      });
    }

    // Log the successful addition of the company logo
    await createLog(
      path,
      action,
      "Logo added successfully",
      "Success",
      user,
      ip,
      company,
      newCompanyLogo._id,
      { companyLogo }
    );

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
      return res.status(400).json({ message: "Field is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID provided" });
    }

    // Define fields that require population
    const fieldsToPopulate = {
      selectedDepartments: "selectedDepartments.department",
      employeeTypes: "",
      workLocations: "",
      leaveTypes: "",
      shifts: "",
    };

    let query = Company.findOne({ _id: companyId }).select(field);

    // Populate if the field is in the fieldsToPopulate map
    if (fieldsToPopulate[field]) {
      query = query.populate(fieldsToPopulate[field]);
    }

    const fetchedData = await query.exec();

    if (!fetchedData || !fetchedData[field]) {
      return res.status(400).json({ message: "Couldn't fetch the data" });
    }

    return res.status(200).json({ [field]: fetchedData[field] });
  } catch (error) {
    next(error);
  }
};

const updateActiveStatus = async (req, res, next) => {
  const { status, name } = req.body;
  const { field } = req.params;
  const companyId = req.userData.company;
  const user = req.user;
  const ip = req.ip;
  let path = "CompanyLogs";
  let action = "Update Active Status";

  try {
    if (!field) {
      await createLog(
        path,
        action,
        "Field is missing",
        "Failed",
        user,
        ip,
        companyId
      );
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (typeof status != "boolean") {
      await createLog(
        path,
        action,
        "Status should be a boolean",
        "Failed",
        user,
        ip,
        companyId
      );
      return res.status(400).json({
        message: "Status should be a boolean",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      await createLog(
        path,
        action,
        "Invalid company ID provided",
        "Failed",
        user,
        ip,
        companyId
      );
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
      await createLog(
        path,
        action,
        "Couldn't update status",
        "Failed",
        user,
        ip,
        companyId
      );
      return res.status(400).json({
        message: "Couldn't update status",
      });
    }

    // Log the successful status update
    await createLog(
      path,
      action,
      "Status updated successfully",
      "Success",
      user,
      ip,
      companyId,
      updatedStatus._id,
      { field, status }
    );

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
