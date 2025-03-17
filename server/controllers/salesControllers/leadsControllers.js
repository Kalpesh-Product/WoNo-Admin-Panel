const mongoose = require("mongoose");
const Lead = require("../../models/sales/Lead");
const Unit = require("../../models/locations/Unit");

const createLead = async (req, res, next) => {
  const logPath = "sales/SalesLog";
  const logAction = "Create Lead";
  const logSourceKey = "lead";

  const { user, ip, company } = req;

  try {
    const {
      dateOfContact,
      companyName,
      serviceCategory,
      leadStatus,
      proposedLocations,
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

    if (
      !dateOfContact ||
      !companyName ||
      !serviceCategory ||
      !leadStatus ||
      !proposedLocations ||
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
      throw new CustomError(
        "All required fields must be provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const currDate = new Date();
    if (new Date(startDate) < currDate) {
      throw new CustomError(
        "Start date must be a future date",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const leadExists = await Lead.findOne({ emailAddress });
    if (leadExists) {
      throw new CustomError(
        "Lead already exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(proposedLocations)) {
      throw new CustomError(
        "Invalid proposed location ID",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const unitExists = await Unit.findOne({ _id: proposedLocations });
    if (!unitExists) {
      throw new CustomError(
        "Proposed location doesn't exist",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (totalDesks < 1 || clientBudget <= 0) {
      throw new CustomError(
        "Invalid numerical values",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const lead = new Lead({
      dateOfContact,
      companyName,
      serviceCategory,
      leadStatus,
      proposedLocations,
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

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Lead created successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: lead._id,
      changes: lead,
    });

    return res.status(201).json({ message: "Lead created successfully" });
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

const getLeads = async (req, res, next) => {
  try {
    const { company } = req;
    const leads = await Lead.find({ company }).populate(
      "serviceCategory proposedLocations"
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
