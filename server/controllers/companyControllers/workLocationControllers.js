const Company = require("../../models/Company");
const mongoose = require("mongoose");
const csvParser = require("csv-parser");
const { Readable } = require("stream");

const addWorkLocation = async (req, res, next) => {
  const { workLocation } = req.body;
  const companyId = req.userData.company;

  try {
    if (!companyId || !workLocation) {
      return res.status(400).json({
        message: "All feilds are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({
        message: "Invalid companyId provided",
      });
    }

    const updateWorkLocation = await Company.findByIdAndUpdate(
      { _id: companyId },
      {
        $push: {
          workLocations: {
            name: workLocation,
          },
        },
        new: true,
      }
    );

    if (!updateWorkLocation) {
      return res.status(400).json({
        message: "Couldn't add work location",
      });
    }
    updateWorkLocation;
    return res.status(200).json({
      message: "Work location added successfully",
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
        if (row["Building Name"] && row["Full Address"] && row["Unit No"]) {
          workLocations.push({
            name: row["Building Name"],
            fullAddress: row["Full Address"],
            unitNo: row["Unit No"],
            isActive: true,
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

module.exports = { addWorkLocation, bulkInsertWorkLocations };
