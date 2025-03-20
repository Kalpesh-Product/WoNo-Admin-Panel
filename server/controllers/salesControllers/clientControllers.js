const Company = require("../../models/hr/Company");
const Unit = require("../../models/locations/Unit");
const CoworkingClient = require("../../models/sales/CoworkingClient");
const mongoose = require("mongoose");
const Desk = require("../../models/sales/Desk");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");

const createClient = async (req, res, next) => {
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

    const bookedDesks = cabinDesks + openDesks;
    if (bookedDesks < 1 || ratePerDesk <= 0 || annualIncrement < 0) {
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

    //Creating or updating deskBooking entry

    const totalSeats = unitExists.cabinDesks + unitExists.openDesks;

    const bookedSeats = totalBookedDesks;
    const availableSeats = totalSeats - bookedSeats;

    // Create start and end boundaries
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startOfMonth = new Date(year, month);
    const endOfMonth = new Date(year, month + 1, 1);

    const bookingExists = await DeskBooking.findOne({
      unit,
      month: { $gte: startOfMonth, $lt: endOfMonth },
    });

    let newbooking = null;

    if (bookingExists) {
      const totalBookedSeats = bookedSeats + bookingExists.bookedSeats;
      await DeskBooking.findOneAndUpdate(
        { _id: bookingExists._id },
        {
          bookedSeats: totalBookedSeats,
          availableSeats: totalSeats - totalBookedSeats,
        }
      );
    } else {
      const booking = await DeskBooking({
        unit,
        bookedSeats,
        availableSeats,
        month: startDate,
        company,
      });

      newbooking = await booking.save();
    }

    const client = new CoworkingClient({
      company,
      clientName,
      service,
      sector,
      hoCity,
      hoState,
      unit,
      cabinDesks,
      openDesks,
      totalDesks: bookedDesks,
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

    //Creating deskBooking entry

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 1);

    const fetchedBookedDesks = await Desk.find({
      unit,
      month: { $gte: startOfMonth, $lt: endOfMonth },
    });

    const totalDesks = unitExists.cabinDesks + unitExists.openDesks;

    console.log("fetchedBookedDesks", fetchedBookedDesks);

    let availableDesks = totalDesks - bookedDesks;
    let totalBookedDesks;

    if (!fetchedBookedDesks) {
      totalBookedDesks = fetchedBookedDesks.reduce((acc, desk) => {
        acc + desk.bookedSeats;
      }, 0);

      availableDesks = totalDesks - totalBookedDesks;
    }

    const booking = await Desk({
      unit,
      bookedSeats: bookedDesks,
      availableSeats: availableDesks,
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
          bookedSeats: bookedDesks,
          availableSeats: availableDesks,
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

const getClients = async (req, res, next) => {
  try {
    const { company } = req;
    const clients = await CoworkingClient.find({ company }).populate([
      {
        path: "unit",
        select: "_id unitName unitNo",
        populate: { path: "building", select: "_id buildingName fullAddress" },
      },
      { path: "service", select: "_id serviceName description" },
    ]);
    if (!clients.length) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const client = await CoworkingClient.findById(id).populate("unit service");
    if (!client) {
      return res.status(404).json({ message: "CoworkingClient not found" });
    }
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
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

const deleteClient = async (req, res, next) => {
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

const getClientsUnitWise = async (req, res, next) => {
  const { company } = req;
  const { unitId } = req.params;

  try {
    const companyExists = await Company.findById(company);

    if (!companyExists) {
      return res.status(400).json({ message: "Company not found" });
    }

    if (!mongoose.Types.ObjectId.isValid(unitId)) {
      return res.status(400).json({ message: "Invalid unit ID provided" });
    }

    const clients = await CoworkingClient.find({ unit: unitId });

    if (!clients.length) {
      return res.status(200).json([]);
    }

    return res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  getClientById,
  getClients,
  getClientsUnitWise,
};
