const Unit = require("../../models/locations/Unit");
const CoworkingClient = require("../../models/sales/CoworkingClient");
const mongoose = require("mongoose");
const Desk = require("../../models/sales/Desk");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");
const { Readable } = require("stream");
const csvParser = require("csv-parser");

const createCoworkingClient = async (req, res, next) => {
  const logPath = "sales/SalesLog";
  const logAction = "Onboard CoworkingClient";
  const logSourceKey = "client";
  const { user, ip, company } = req;

  try {
    const {
      clientName,
      service,
      sector,
      hoCity,
      hoState,
      unit,
      cabinDesks,
      openDesks,
      ratePerDesk,
      annualIncrement,
      perDeskMeetingCredits,
      totalMeetingCredits,
      startDate,
      endDate,
      lockinPeriod,
      rentDate,
      nextIncrement,
      localPocName,
      localPocEmail,
      localPocPhone,
      hOPocName,
      hOPocEmail,
      hOPocPhone,
    } = req.body;

    const clientExists = await CoworkingClient.findOne({ clientName });
    if (clientExists) {
      throw new CustomError(
        "CoworkingClient already exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(unit)) {
      throw new CustomError(
        "Invalid unit ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }
    const unitExists = await Unit.findOne({ _id: unit });
    if (!unitExists) {
      throw new CustomError(
        "Unit doesn't exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (
      !clientName ||
      !service ||
      !sector ||
      !hoCity ||
      !hoState ||
      !ratePerDesk ||
      !annualIncrement ||
      !startDate ||
      !endDate ||
      !lockinPeriod ||
      !rentDate ||
      !nextIncrement ||
      !localPocName ||
      !localPocEmail ||
      !localPocPhone ||
      !hOPocName ||
      !hOPocEmail ||
      !hOPocPhone
    ) {
      throw new CustomError(
        "All required fields must be provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const totalBookedDesks = cabinDesks + openDesks;
    if (totalBookedDesks < 1 || ratePerDesk <= 0 || annualIncrement < 0) {
      throw new CustomError(
        "Invalid numerical values",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new CustomError(
        "Start date must be before end date",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const client = new Client({
      company,
      clientName,
      service,
      sector,
      hoCity,
      hoState,
      unit,
      cabinDesks,
      openDesks,
      totalDesks: totalBookedDesks,
      ratePerDesk,
      annualIncrement,
      perDeskMeetingCredits,
      totalMeetingCredits,
      startDate,
      endDate,
      lockinPeriod,
      rentDate,
      nextIncrement,
      hOPoc: {
        name: hOPocName,
        email: hOPocEmail,
        phone: hOPocPhone,
      },
      localPoc: {
        name: localPocName,
        email: localPocEmail,
        phone: localPocPhone,
      },
    });

    const savedClient = await client.save();

    //Creating or updating deskBooking entry

    const totalSeats = unitExists.cabinDesks + unitExists.openDesks;

    const bookedSeats = totalBookedDesks;
    const availableSeats = totalSeats - bookedSeats;
    const booking = await Desk({
      unit,
      bookedSeats,
      availableSeats,
      month: startDate,
      service,
      client: savedClient._id,
      company,
    });

    const newbooking = await booking.save();

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "CoworkingClient onboarded successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: savedClient._id,
      changes: {
        client: {
          clientName,
          service,
          sector,
          hoCity,
          hoState,
          unit,
          cabinDesks,
          openDesks,
          totalDesks: totalBookedDesks,
          ratePerDesk,
          annualIncrement,
          perDeskMeetingCredits,
          totalMeetingCredits,
          startDate,
          endDate,
          lockinPeriod,
          rentDate,
          nextIncrement,
          hOPoc: { name: hOPocName, email: hOPocEmail, phone: hOPocPhone },
          localPoc: {
            name: localPocName,
            email: localPocEmail,
            phone: localPocPhone,
          },
        },
        desks: {
          deskId: newbooking ? newbooking._id : bookingExists._id,
          unit,
          bookedSeats,
          availableSeats,
        },
      },
    });

    return res
      .status(201)
      .json({ message: "CoworkingClient onboarded successfully" });
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

const getCoworkingClients = async (req, res, next) => {
  try {
    const { company } = req;
    const { coworkingclientid, unitId } = req.query;

    if (
      coworkingclientid &&
      !mongoose.Types.ObjectId.isValid(coworkingclientid)
    ) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }

    if (unitId && !mongoose.Types.ObjectId.isValid(unitId)) {
      return res.status(400).json({ message: "Invalid unit ID format" });
    }

    let query = { company };

    if (coworkingclientid) {
      query = { _id: coworkingclientid };
    } else if (unitId) {
      query.unit = unitId;
    }

    const populateOptions = [
      {
        path: "unit",
        select: "_id unitName unitNo",
        populate: {
          path: "building",
          select: "_id buildingName fullAddress",
        },
      },
      { path: "service", select: "_id serviceName description" },
    ];

    const clients = await CoworkingClient.find(query)
      .populate(populateOptions)
      .lean()
      .exec();

    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: "No clients found" });
    }

    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const updateCoworkingClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const client = await CoworkingClient.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company unit");
    if (!client) {
      return res.status(404).json({ message: "CoworkingClient not found" });
    }
    res
      .status(200)
      .json({ message: "CoworkingClient updated successfully", client });
  } catch (error) {
    next(error);
  }
};

const deleteCoworkingClient = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID provided" });
    }
    const client = await CoworkingClient.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: "CoworkingClient not found" });
    }
    res
      .status(200)
      .json({ message: "CoworkingClient deactivated successfully" });
  } catch (error) {
    next(error);
  }
};

const bulkInsertCoworkingClients = async (req, res, next) => {
  try {
    const file = req.file;
    const company = req.company;

    if (!file) {
      return res.status(400).json({ message: "Please provide a CSV file" });
    }

    
    const units = await Unit.find({ company })
      .populate([{ path: "building", select: "buildingName" }])
      .lean()
      .exec();

    const unitMap = new Map(units.map((unit) => [unit.unitNo, unit._id]));

    // Convert file buffer to readable stream
    const stream = Readable.from(file.buffer.toString("utf-8").trim());

    let coWorkingClients = [];
    
    
    stream
      .pipe(csvParser())
      .on("data", (row) => {
        const {
          clientName,
          service,
          sector,
          hoCity,
          hoState,
          unitNo,
          cabinDesks,
          openDesks,
          ratePerDesk,
          annualIncrement,
          perDeskMeetingCredits,
          startDate,
          endDate,
          lockinPeriod,
          bookingType,
          rentDate,
          localPocName,
          localPocEmail,
          localPocPhone,
          hoPocName,
          hoPocEmail,
          hoPocPhone
        } = row;

        const unitId = unitMap.get(unitNo);
        if (!unitId) {
          console.warn(`Unit not found for unitNo: ${unitNo}`);
          return; // Skip this row if unit is not found
        }

        const totalDesks = parseInt(cabinDesks) + parseInt(openDesks);
        const totalMeetingCredits = totalDesks * parseInt(perDeskMeetingCredits);

        const newClientObj = {
          company,
          clientName,
          service,
          sector,
          hoCity,
          hoState,
          unit: unitId,
          cabinDesks: parseInt(cabinDesks) || 0,
          openDesks: parseInt(openDesks) || 0,
          totalDesks,
          ratePerDesk: parseFloat(ratePerDesk) || 0,
          annualIncrement: parseFloat(annualIncrement) || 0,
          perDeskMeetingCredits: parseInt(perDeskMeetingCredits) || 0,
          totalMeetingCredits,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          lockinPeriod: parseInt(lockinPeriod) || 0,
          bookingType,
          rentDate: rentDate ? new Date(rentDate) : null,
          nextIncrement: rentDate ? new Date(rentDate) : null, // Assuming next increment starts from rent date
          localPoc: {
            name: localPocName,
            email: localPocEmail,
            phone: localPocPhone,
          },
          hOPoc: {
            name: hoPocName,
            email: hoPocEmail,
            phone: hoPocPhone,
          },
          isActive: true,
        };

        coWorkingClients.push(newClientObj);
      })
      .on("end", async () => {
        try {
          if (coWorkingClients.length === 0) {
            return res.status(400).json({ message: "No valid clients found in the file" });
          }

          // Insert into MongoDB
          await CoworkingClient.insertMany(coWorkingClients);
          res.status(201).json({ message: `${coWorkingClients.length} clients inserted successfully` });
        } catch (err) {
          next(err);
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        next(error);
      });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCoworkingClient,
  updateCoworkingClient,
  deleteCoworkingClient,
  getCoworkingClients,
  bulkInsertCoworkingClients
};
