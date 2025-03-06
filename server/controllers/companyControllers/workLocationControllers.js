const Company = require("../../models/hr/Company");
const mongoose = require("mongoose");
const { createLog } = require("../../utils/moduleLogs");
const csvParser = require("csv-parser");
const { Readable } = require("stream");
const crypto = require("crypto");
const CustomError = require("../../utils/customErrorlogs");
const {
  handleFileUpload,
  handleFileDelete,
} = require("../../config/cloudinaryConfig");

const addWorkLocation = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Add Work Location";
  const logSourceKey = "companyData";
  const { user, ip, company } = req;
  const { buildingName, floor, wing } = req.body;

  try {
    if (!company || !buildingName) {
      throw new CustomError(
        "Company and Building Name are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      throw new CustomError(
        "Invalid company provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const newWorkLocation = {
      id: crypto.randomUUID(),
      buildingName,
      floor: floor || "",
      wing: wing || "",
      isActive: true,
      occupiedImage: { id: "", url: "" },
      clearImage: { id: "", url: "" },
    };

    const updatedCompany = await Company.findByIdAndUpdate(
      company,
      { $push: { workLocations: newWorkLocation } },
      { new: true }
    );

    if (!updatedCompany) {
      throw new CustomError(
        "Couldn't add work location",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Work location added successfully",
      status: "Success",
      user,
      ip,
      company,
      sourceKey: logSourceKey,
      sourceId: updatedCompany._id,
      changes: { workLocation: newWorkLocation },
    });

    return res.status(200).json({
      message: "Work location added successfully",
      workLocation: newWorkLocation,
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const uploadCompanyLocationImage = async (req, res, next) => {
  try {
    const { locationId, imageType } = req.body;
    const file = req.file; // Multer stores a single file in req.file
    const companyId = req.company;

    if (!file) {
      return res.status(400).json({ message: "No image provided" });
    }

    if (!locationId || !companyId || !imageType) {
      return res.status(400).json({
        message: "Company ID, Location ID, and Image Type are required",
      });
    }

    if (!["occupiedImage", "clearImage"].includes(imageType)) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    // Find the company
    const company = await Company.findOne({ companyId });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find the work location
    const workLocation = company.workLocations.find(
      (loc) => loc.id === locationId
    );
    if (!workLocation) {
      return res.status(404).json({ message: "Work location not found" });
    }

    // Delete the existing image if it exists
    if (workLocation[imageType] && workLocation[imageType].id) {
      await handleFileDelete(workLocation[imageType].id);
    }

    const folderPath = `${company.companyName}/work-locations/${workLocation.buildingName}/${workLocation.wing}/${workLocation.floor}`;
    const uploadResult = await handleFileUpload(file.path, folderPath);

    // Update the specific image type in the work location
    workLocation[imageType] = {
      id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
    await company.save();

    res.json({
      message: "Image uploaded and work location updated successfully",
      workLocation: { [imageType]: workLocation[imageType] },
    });
  } catch (error) {
    next(error);
  }
};

const bulkInsertWorkLocations = async (req, res, next) => {
  try {
    const companyId = req.userData.company;
    if (!req.file) {
      return res.status(400).json({ message: "Please provide a csv file" });
    }

    if (!companyId) {
      return res
        .status(400)
        .json({ message: "Company ID and CSV data are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid companyId provided" });
    }

    const workLocations = [];
    const stream = Readable.from(req.file.buffer.toString("utf-8").trim());

    stream
      .pipe(csvParser())
      .on("data", (row) => {
        if (row["Building Name"] && row["Floor"] && row["Wing"]) {
          workLocations.push({
            id: crypto.randomUUID(), 
            buildingName: row["Building Name"],
            fullAddress: row["Floor"],
            unitNo: row["Wing"],
            isActive: true,
            occupiedImage: { id: "", url: "" },
            clearImage: { id: "", url: "" },
          });
        }
      })
      .on("end", async () => {
        if (workLocations.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid work locations found in the CSV" });
        }

        const updatedCompany = await Company.findByIdAndUpdate(
          companyId,
          { $push: { workLocations: { $each: workLocations } } },
          { new: true }
        );

        if (!updatedCompany) {
          return res
            .status(400)
            .json({ message: "Couldn't update company with work locations" });
        }

        return res.status(200).json({
          message: "Work locations added successfully",
          workLocations: updatedCompany.workLocations,
        });
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addWorkLocation,
  bulkInsertWorkLocations,
  uploadCompanyLocationImage,
};
