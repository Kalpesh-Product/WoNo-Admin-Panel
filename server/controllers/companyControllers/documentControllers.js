const Company = require("../../models/Company");
const User = require("../../models/UserData");
const { handlePdfUpload } = require("../../config/cloudinaryConfig");
const { PDFDocument } = require("pdf-lib");

const uploadTemplate = async (req, res, next) => {
  try {
    const file = req.file;
    const user = req.user;
    const { documentName } = req.body;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    const pdfDoc = await PDFDocument.load(file.buffer);
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    const processedBuffer = await pdfDoc.save();

    const response = await handlePdfUpload(
      processedBuffer,
      `${foundUser.company.companyName}/templates`
    );

    if (!response.public_id) {
      throw new Error("falied to upload document");
    }

    await Company.findOneAndUpdate(
      { _id: foundUser.company._id },
      {
        $push: {
          templates: {
            name: documentName,
            documentLink: response.secure_url,
            documentId: response.public_id,
          },
        },
      }
    ).exec();
    return res.status(200).json({ message: "Template uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

const addSop = async (req, res, next) => {
  try {
    const { sopName } = req.body;
    const file = req.file;
    const user = req.user;

    console.log(file)
    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    const pdfDoc = await PDFDocument.load(file.buffer);
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    const processedBuffer = await pdfDoc.save();

    const response = await handlePdfUpload(
      processedBuffer,
      `${foundUser.company.companyName}/SOP`
    );

    if (!response.public_id) {
      throw new Error("falied to upload document");
    }

    await Company.findOneAndUpdate(
      { _id: foundUser.company._id },
      {
        $push: {
          sop: {
            name: sopName,
            documentLink: response.secure_url,
            documentId: response.public_id,
          },
        },
      }
    ).exec();
    return res.status(200).json({ message: "SOP uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

const addPolicy = async (req, res, next) => {
  try {
    const { policyName } = req.body;
    const file = req.file;
    const user = req.user;

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    const pdfDoc = await PDFDocument.load(file.buffer);
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    const processedBuffer = await pdfDoc.save();

    const response = await handlePdfUpload(
      processedBuffer,
      `${foundUser.company.companyName}/policies`
    );

    if (!response.public_id) {
      throw new Error("falied to upload document");
    }

    await Company.findOneAndUpdate(
      { _id: foundUser.company._id },
      {
        $push: {
          policies: {
            name: policyName,
            documentLink: response.secure_url,
            documentId: response.public_id,
          },
        },
      }
    ).exec();
    return res.status(200).json({ message: "policy uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

const addAgreement = async (req, res, next) => {
  try {
    const { agreementName } = req.body;
    const file = req.file;
    const user = req.user;
 
    console.log(agreementName)
    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .populate([{ path: "company", select: "companyName" }])
      .lean()
      .exec();

    const pdfDoc = await PDFDocument.load(file.buffer);
     
    pdfDoc.setTitle(file.originalname?.split(".")[0]);
    console.log(file.originalname?.split(".")[0])
    const processedBuffer = await pdfDoc.save();

    const response = await handlePdfUpload(
      processedBuffer,
      `${foundUser.company.companyName}/agreements`
    );

    if (!response.public_id) {
      throw new Error("falied to upload document");
    }

    await Company.findOneAndUpdate(
      { _id: foundUser.company._id },
      {
        $push: {
          agreements: {
            name: agreementName,
            documentLink: response.secure_url,
            documentId: response.public_id,
          },
        },
      }
    ).exec();
    return res.status(200).json({ message: "Agreement uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadTemplate, addPolicy, addSop, addAgreement };
