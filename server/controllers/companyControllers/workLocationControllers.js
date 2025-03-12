const Company = require("../../models/hr/Company");
const mongoose = require("mongoose");
const { createLog } = require("../../utils/moduleLogs");
const csvParser = require("csv-parser");
const { Readable } = require("stream");
const CustomError = require("../../utils/customErrorlogs");
const WorkLocation = require("../../models/hr/WorkLocations");
const {
  handleFileUpload,
  handleFileDelete,
} = require("../../config/cloudinaryConfig");
const Unit = require("../../models/locations/Unit");
const Building = require("../../models/locations/Building");

const addBuilding = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Add Building";
  const logSourceKey = "building";
  const { user, ip, company } = req;
  const { buildingName, fullAddress } = req.body;

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

    // Check if the company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      throw new CustomError(
        "Company not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Create new WorkLocation
    const newBuilding = new Building({
      company,
      buildingName,
      fullAddress: fullAddress || "",
    });

    const savedBuilding = await newBuilding.save();

    // Update the company document by adding the work location reference
    existingCompany.workLocations.push(savedBuilding._id);
    await existingCompany.save();

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Work location added successfully",
      status: "Success",
      user,
      ip,
      company,
      sourceKey: logSourceKey,
      sourceId: savedBuilding._id,
      changes: { workLocation: newBuilding },
    });

    return res.status(200).json({
      message: "Work location added successfully",
      workLocation: newBuilding,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError(error.message, logPath, logAction, logSourceKey, 500)
      );
    }
  }
};

const addUnit = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Add Unit";
  const logSourceKey = "unit";
  const { user, ip, company } = req;
  const { buildingId, unitName, unitNo, clearImage, occupiedImage } = req.body;

  try {
    if (!company || !unitName || !unitNo || !buildingId) {
      throw new CustomError(
        "Missing required fields",
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

    // Check if the company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      throw new CustomError(
        "Company not found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Create new WorkLocation
    const newUnit = new Unit({
      company,
      unitName,
      unitNo,
      building: buildingId,
      clearImage: clearImage ? clearImage : "",
      occupiedImage: occupiedImage ? occupiedImage : "",
    });

    const savedUnit = await newUnit.save();

    // Update the company document by adding the work location reference
    existingCompany.workLocations.push(savedUnit._id);
    await existingCompany.save();

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Work location added successfully",
      status: "Success",
      user,
      ip,
      company,
      sourceKey: logSourceKey,
      sourceId: savedUnit._id,
      changes: { workLocation: newUnit },
    });

    return res.status(200).json({
      message: "Work location added successfully",
      workLocation: newUnit,
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError(error.message, logPath, logAction, logSourceKey, 500)
      );
    }
  }
};

const uploadCompanyLocationImage = async (req, res, next) => {
  try {
    const { unitId, imageType } = req.body;
    const file = req.file; // Multer stores a single file in req.file
    const companyId = req.company;

    if (!file) {
      return res.status(400).json({ message: "No image provided" });
    }

    if (!unitId || !companyId || !imageType) {
      return res.status(400).json({
        message: "Company ID, Location ID, and Image Type are required",
      });
    }

    if (!["occupiedImage", "clearImage"].includes(imageType)) {
      return res.status(400).json({ message: "Invalid image type" });
    }

    // Find the work location
    const workLocation = await WorkLocation.findById(unitId);
    if (!workLocation || workLocation.company.toString() !== companyId) {
      return res.status(404).json({ message: "Work location not found" });
    }

    // Delete the existing image if it exists
    if (workLocation[imageType] && workLocation[imageType].id) {
      await handleFileDelete(workLocation[imageType].id);
    }

    const folderPath = `${companyId}/work-locations/${workLocation.name}`;
    const uploadResult = await handleFileUpload(file.path, folderPath);

    // Update the specific image type in the work location
    workLocation[imageType] = {
      id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
    await workLocation.save();

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
    const companyId = req.company;
    if (!req.file) {
      return res.status(400).json({ message: "Please provide a CSV file" });
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
        workLocations.push({
          company: companyId,
          name: row["Building Name"],
          fullAddress: row["Full Address"],
          unit: {
            unitNo: row["Unit Name"],
            unitName: row["Unit No"],
          },
          isActive: true,
          occupiedImage: { id: "", url: "" },
          clearImage: { id: "", url: "" },
        });
      })
      .on("end", async () => {
        if (workLocations.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid work locations found in the CSV" });
        }

        const insertedWorkLocations = await WorkLocation.insertMany(
          workLocations
        );
        const workLocationIds = insertedWorkLocations.map((loc) => loc._id);

        const updatedCompany = await Company.findByIdAndUpdate(
          companyId,
          { $push: { workLocations: { $each: workLocationIds } } },
          { new: true }
        );

        if (!updatedCompany) {
          return res
            .status(400)
            .json({ message: "Couldn't update company with work locations" });
        }

        return res.status(200).json({
          message: "Work locations added successfully",
          workLocations: insertedWorkLocations,
        });
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBuilding,
  addUnit,
  bulkInsertWorkLocations,
  uploadCompanyLocationImage,
};
