const Company = require("../../models/hr/Company");
const mongoose = require("mongoose");
const { createLog } = require("../../utils/moduleLogs");
const csvParser = require("csv-parser");
const { Readable } = require("stream");
const CustomError = require("../../utils/customErrorlogs");
const {
  handleFileUpload,
  handleFileDelete,
} = require("../../config/cloudinaryConfig");
const Unit = require("../../models/locations/Unit");
const Building = require("../../models/locations/Building");
const UserData = require("../../models/hr/UserData");

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
        "Invalid company ID provided",
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
    await Company.findOneAndUpdate(
      { _id: company },
      {
        $push: { workLocations: savedBuilding._id },
      },
      { new: true, useFindAndModify: false }
    );

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
      changes: newBuilding,
    });

    return res.status(200).json({
      message: "Building added successfully",
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
        "Invalid company ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(buildingId)) {
      throw new CustomError(
        "Invalid building ID provided",
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

    const existingBuilding = await Building.findById(buildingId);
    if (!existingBuilding) {
      throw new CustomError(
        "Building not found",
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
      changes: newUnit,
    });

    return res.status(200).json({
      message: "Unit added successfully",
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

const fetchUnits = async (req, res, next) => {
  const { user, company } = req;

  try {
    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(400).json({ message: "Company not found" });
    }

    const foundUser = await UserData.findById({ _id: user }).populate({
      path: "workLocation",
      select: "_id unitName unitNo",
      populate: {
        path: "building",
        select: "_id buildingName fullAddress",
      },
    });

    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const units = await Unit.find({
      building: foundUser.workLocation.building,
    });

    if (!units.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(units);
  } catch (error) {
    next(error);
  }
};

const uploadUnitImage = async (req, res, next) => {
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
    const unit = await Unit.findById(unitId).populate([
      { path: "building", select: "buildingName" },
      { path: "company", select: "companyName" },
    ]);
    if (!unit || unit.company.toString() !== companyId) {
      return res.status(404).json({ message: "Work location not found" });
    }

    if (unit[imageType] && unit[imageType].imageId) {
      await handleFileDelete(unit[imageType].imageId);
    }

    const folderPath = `${unit.company.companyName}/work-locations/${unit.building.buildingName}/${unit.unitName}`;
    const uploadResult = await handleFileUpload(file.path, folderPath);

    unit[imageType] = {
      imageId: uploadResult.public_id,
      url: uploadResult.secure_url,
    };
    await unit.save();

    res.json({
      message: "Image uploaded and work location updated successfully",
      workLocation: { [imageType]: unit[imageType] },
    });
  } catch (error) {
    next(error);
  }
};

const bulkInsertUnits = async (req, res, next) => {
  try {
    const companyId = req.company;
    const { buildingId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Please provide a CSV file" });
    }

    if (!companyId || !buildingId) {
      return res
        .status(400)
        .json({ message: "Company ID and CSV data are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid companyId provided" });
    }

    const units = [];
    const stream = Readable.from(req.file.buffer.toString("utf-8").trim());

    stream
      .pipe(csvParser())
      .on("data", (row) => {
        units.push({
          company: companyId,
          building: buildingId,
          unitName: row["Floor"],
          unitNo: row["Unit Number"],
          isActive: true,
          occupiedImage: { imageId: "", url: "" },
          clearImage: { imageId: "", url: "" },
        });
      })
      .on("end", async () => {
        if (units.length === 0) {
          return res
            .status(400)
            .json({ message: "No valid work locations found in the CSV" });
        }

        const insertedUnits = await Unit.insertMany(units);
        const workLocationIds = insertedUnits.map((loc) => loc._id);

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
          workLocations: insertedUnits,
        });
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBuilding,
  addUnit,
  fetchUnits,
  bulkInsertUnits,
  uploadUnitImage,
};
