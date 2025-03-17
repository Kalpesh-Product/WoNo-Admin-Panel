const Unit = require("../../models/locations/Unit");
const Client = require("../../models/sales/Client");
const mongoose = require("mongoose");

const createClient = async (req, res, next) => {
  const logPath = "sales/SalesLog";
  const logAction = "Onboard Client";
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
      totalDesks,
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

    const clientExists = await Client.findOne({ clientName });
    if (clientExists) {
      throw new CustomError(
        "Client already exists",
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
      !totalDesks ||
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

    if (totalDesks < 1 || ratePerDesk <= 0 || annualIncrement < 0) {
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
      totalDesks,
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

    await client.save();

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Client onboarded successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: client._id,
      changes: {
        clientName,
        service,
        sector,
        hoCity,
        hoState,
        unit,
        cabinDesks,
        openDesks,
        totalDesks,
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
    });

    return res.status(201).json({ message: "Client onboarded successfully" });
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
    const clients = await Client.find({ company }).populate("unit");
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
    const client = await Client.findById(id).populate("company unit");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
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
    const client = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("company unit");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client updated successfully", client });
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
    const client = await Client.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client deactivated successfully" });
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
};
