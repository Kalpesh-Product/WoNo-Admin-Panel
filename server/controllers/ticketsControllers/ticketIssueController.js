const mongoose = require("mongoose");
const Company = require("../../models/hr/Company");
const User = require("../../models/hr/UserData");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");

const addTicketIssue = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Add Ticket Issue";
  const logSourceKey = "companyData";
  const { user, company, ip } = req;

  try {
    const { title, department, priority = "Low" } = req.body;

    if (!title) {
      throw new CustomError(
        "Title is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Retrieve the user to get company info
    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();

    if (!mongoose.Types.ObjectId.isValid(department)) {
      throw new CustomError(
        "Invalid department ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the department's ticketIssues array atomically
    const updatedCompany = await Company.findOneAndUpdate(
      {
        $and: [
          { _id: foundUser.company },
          { "selectedDepartments.department": department },
        ],
      },
      {
        $push: {
          "selectedDepartments.$.ticketIssues": { title, priority },
        },
      },
      { new: true }
    );

    if (!updatedCompany) {
      throw new CustomError(
        "Department not found in any company",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "New issue added successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: null,
      changes: { title, priority, department },
    });

    return res.status(201).json({ message: "New issue added successfully" });
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

const getTicketIssue = async (req, res, next) => {
  try {
    const { department } = req.params;

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res
        .status(400)
        .json({ message: "Invalid department ID provided" });
    }

    // Find the company containing the department and retrieve the ticket issues
    const company = await Company.findOne(
      { "selectedDepartments.department": department },
      { "selectedDepartments.$": 1 }
    ).lean();

    if (!company || !company.selectedDepartments.length) {
      return res
        .status(404)
        .json({ message: "Department not found in any company" });
    }

    const ticketIssues = company.selectedDepartments[0].ticketIssues || [];

    if (ticketIssues.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json(ticketIssues);
  } catch (error) {
    next(error);
  }
};

module.exports = { addTicketIssue, getTicketIssue };
