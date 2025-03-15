const Unit = require("../../models/locations/Unit");
const Client = require("../../models/sales/Client");
const { handleDocumentUpload } = require("../../config/cloudinaryConfig");
const multer = require("multer");
const Company = require("../../models/hr/Company");
const { PDFDocument } = require("pdf-lib");

//Onboard a new client

const createClient = async (req, res) => {
  try {
    const { company } = req;
    const {
      clientName,
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

    //Check if client already exists

    const clientExists = await Client.findOne({ clientName });

    if (clientExists) {
      return res.status(400).json({ message: "Client already exists" });
    }
    // Basic validation
    if (
      !clientName ||
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
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (totalDesks < 1 || ratePerDesk <= 0 || annualIncrement < 0) {
      return res.status(400).json({ message: "Invalid numerical values" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Start date must be before end date" });
    }

    // Create client object
    const client = new Client({
      company,
      clientName,
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
    res.status(201).json({ message: "Client onboarded successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all clients with validation
const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find().populate("unit");
    if (!clients.length) {
      return res.status(404).json({ message: "No clients found" });
    }
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

// Get a single client by ID with validation
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

// Update client details with validation
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
    res.status(400).json({ message: error.message });
  }
};

// Delete a client (soft delete by setting isActive to false) with validation
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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClient,
  updateClient,
  deleteClient,
  getClientById,
  getClients,
};
