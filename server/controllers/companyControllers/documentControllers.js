const Company = require("../../models/Company");
const User = require("../../models/UserData");
const { handleDocumentUpload } = require("../../config/cloudinaryConfig");
const { PDFDocument } = require("pdf-lib");

const uploadCompanyDocument = async (req, res, next) => {
  try {
    const { documentName, type } = req.body;
    const file = req.file;
    const user = req.user;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!["template", "sop", "policy", "agreement"].includes(type)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    const foundUser = await User.findById(user)
      .select("company")
      .populate("company", "companyName")
      .lean();

    if (!foundUser?.company) {
      return res.status(404).json({ message: "Company not found" });
    }

    let processedBuffer = file.buffer;
    const originalFilename = file.originalname;

    const response = await handleDocumentUpload(
      processedBuffer,
      `${foundUser.company.companyName}/${type}s`,
      originalFilename
    );

    if (!response?.public_id) {
      throw new Error("Failed to upload document");
    }

    const updateField = {
      template: "templates",
      sop: "sop",
      policy: "policies",
      agreement: "agreements",
    }[type];

    await Company.findByIdAndUpdate(foundUser.company._id, {
      $push: {
        [updateField]: {
          name: documentName,
          documentLink: response.secure_url,
          documentId: response.public_id,
        },
      },
    });

    return res
      .status(200)
      .json({ message: `${type.toUpperCase()} uploaded successfully` });
  } catch (error) {
    next(error);
  }
};

const getCompanyDocuments = async (req, res, next) => {
  try {
    const { type } = req.params;
    const user = req.user;

    if (!["templates", "sop", "policies", "agreements"].includes(type)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate(`company`, type)
      .lean()
      .exec();

    if (!foundUser || !foundUser.company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({ [type]: foundUser.company[type] || [] });
  } catch (error) {
    next(error);
  }
};

const uploadDepartmentDocument = async (req, res, next) => {
  try {
    const { documentName, type } = req.body;
    const file = req.file;
    const user = req.user;
    const { departmentId } = req.params;

    if (!["sop", "policy"].includes(type)) {
      throw new Error("Invalid document type. Allowed values: sop, policy");
    }

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    const company = await Company.findOne({ _id: foundUser.company._id })
      .select("selectedDepartments")
      .populate([{ path: "selectedDepartments.department", select: "name" }]);

    const department = company.selectedDepartments.find(
      (dept) => dept.department._id.toString() === departmentId
    );

    if (!department) {
      throw new Error("Department not found in selectedDepartments.");
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    const processedBuffer = await pdfDoc.save();

    const originalFilename = file.originalname;

    const response = await handleDocumentUpload(
      processedBuffer,
      `${foundUser.company.companyName}/departments/${department.department.name}/documents/${type}`,
      originalFilename
    );

    if (!response.public_id) {
      throw new Error("Failed to upload document");
    }

    const updateField =
      type === "sop"
        ? "selectedDepartments.$.sop"
        : "selectedDepartments.$.policies";

    await Company.findOneAndUpdate(
      {
        _id: foundUser.company._id,
        "selectedDepartments.department": departmentId,
      },
      {
        $push: {
          [updateField]: {
            name: documentName,
            documentLink: response.secure_url,
            documentId: response.public_id,
            isActive: true,
          },
        },
      },
      { new: true }
    ).exec();

    return res.status(200).json({
      message: `${type.toUpperCase()} uploaded successfully for ${
        department.department.name
      } department`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCompanyDocument,
  getCompanyDocuments,
  uploadDepartmentDocument,
};
