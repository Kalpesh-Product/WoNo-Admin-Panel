const Company = require("../../models/Company");
const User = require("../../models/UserData");
const { handlePdfUpload } = require("../../config/cloudinaryConfig");
const { PDFDocument } = require("pdf-lib");

const uploadCompanyDocument = async (req, res, next) => {
  try {
    const { documentName, type } = req.body;
    const file = req.file;
    const user = req.user;
    const path = "CompanyLogs";
    const action = "Upload Company Document";

    if (!["template", "sop", "policy", "agreement"].includes(type)) {
      throw new Error(
        "Invalid document type. Allowed values: template, sop, policy"
      );
    }

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    if (!foundUser || !foundUser.company) {
      await createLog(path, action, "Company not found", "Failed", user, req.ip, req.company);
      return res.status(404).json({ message: "Company not found" });
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    const processedBuffer = await pdfDoc.save();

    const response = await handlePdfUpload(
      processedBuffer,
      `${foundUser.company.companyName}/${type}s`
    );

    if (!response.public_id) {
      throw new Error("Failed to upload document");
    }

    const updateField =
      type === "template" ? "templates" : type === "sop" ? "sop" : type === "policy" ? "policies" : "agreements";

    await Company.findOneAndUpdate(
      { _id: foundUser.company._id },
      {
        $push: {
          [updateField]: {
            name: documentName,
            documentLink: response.secure_url,
            documentId: response.public_id,
          },
        },
      }
    ).exec();

    await createLog(path, action, `${type.toUpperCase()} uploaded successfully`, "Success", user, req.ip, req.company, foundUser.company._id);

    return res
      .status(200)
      .json({ message: `${type.toUpperCase()} uploaded successfully` });
  } catch (error) {
    console.error("Error uploading document:", error);
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
    const path = "CompanyLogs";
    const action = "Upload Department Document";

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
      await createLog(path, action, "Department not found in selectedDepartments", "Failed", user, req.ip, req.company);
      throw new Error("Department not found in selectedDepartments.");
    }

    const pdfDoc = await PDFDocument.load(file.buffer);
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    const processedBuffer = await pdfDoc.save();

    const response = await handlePdfUpload(
      processedBuffer,
      `${foundUser.company.companyName}/departments/${department.department.name}/documents/${type}`
    );

    if (!response.public_id) {
      await createLog(path, action, "Failed to upload document", "Failed", user, req.ip, req.company);
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

    await createLog(path, action, `${type.toUpperCase()} uploaded successfully for ${department.department.name} department`, "Success", user, req.ip, req.company, foundUser.company._id);

    return res.status(200).json({
      message: `${type.toUpperCase()} uploaded successfully for ${department.department.name} department`,
    });
  } catch (error) {
    console.error("Error uploading department document:", error);
    next(error);
  }
};


module.exports = {
  uploadCompanyDocument,
  getCompanyDocuments,
  uploadDepartmentDocument,
};
