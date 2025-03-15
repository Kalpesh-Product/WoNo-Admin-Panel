const mongoose = require("mongoose");
const Lead = require("../../models/sales/Lead");
const Unit = require("../../models/locations/Unit");

const createLead = async (req, res, next) => {
  try {
    const {
      dateOfContact,
      companyName,
      serviceCategory,
      leadStatus,
      proposedLocation,
      sector,
      headOfficeLocation,
      officeInGoa,
      pocName,
      designation,
      contactNumber,
      emailAddress,
      leadSource,
      period,
      openDesks,
      cabinDesks,
      totalDesks,
      clientBudget,
      startDate,
      remarksComments,
      lastFollowUpDate,
    } = req.body;

    const leadExists = await Lead.findOne({ emailAddress });

    if (leadExists) {
      return res.status(400).json({ message: "Lead already exists" });
    }

    if (!mongoose.Types.ObjectId.isValid(proposedLocation)) {
      return res.status(400).json({ message: "Invalid proposed location ID" });
    }

    const unitExists = await Unit.findOne({ _id: proposedLocation });

    if (!unitExists) {
      return res
        .status(400)
        .json({ message: "Proposed location doesn't exist" });
    }

    if (
      !dateOfContact ||
      !companyName ||
      !serviceCategory ||
      !leadStatus ||
      !sector ||
      !headOfficeLocation ||
      officeInGoa === undefined ||
      !pocName ||
      !designation ||
      !contactNumber ||
      !emailAddress ||
      !leadSource ||
      !period ||
      !totalDesks ||
      !clientBudget ||
      !startDate
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    if (totalDesks < 1 || clientBudget <= 0) {
      return res.status(400).json({ message: "Invalid numerical values" });
    }

    const lead = new Lead({
      dateOfContact,
      companyName,
      serviceCategory,
      leadStatus,
      proposedLocation,
      sector,
      headOfficeLocation,
      officeInGoa,
      pocName,
      designation,
      contactNumber,
      emailAddress,
      leadSource,
      period,
      openDesks,
      cabinDesks,
      totalDesks,
      clientBudget,
      startDate,
      remarksComments,
      lastFollowUpDate,
    });

    await lead.save();
    res.status(201).json({ message: "Lead created successfully" });
  } catch (error) {
    next(error);
  }
};

const getLeads = async (req, res, next) => {
  try {
    const { company } = req;
    const leads = await Lead.find({ company }).populate(
      "serviceCategory proposedLocation"
    );
    if (!leads.length) {
      return res.status(404).json({ message: "No leads found" });
    }
    res.status(200).json(leads);
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead, getLeads };
