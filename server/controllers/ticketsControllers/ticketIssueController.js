const mongoose = require("mongoose");
const Company = require("../../models/hr/Company");
const User = require("../../models/hr/UserData");
const { createLog } = require("../../utils/moduleLogs");

const addTicketIssue = async (req, res, next) => {
  try {
    const { title, department, priority = "Low" } = req.body;
    const user = req.user;
    const company = req.company;
    const ip = req.ip;
    let path = "tickets/TicketLogs";
    let action = "Add Ticket Issue";

    if (!title) {
      await createLog(
        path,
        action,
        "Title is required",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Title is required" });
    }

    const foundUser = await User.findOne({ _id: user })
      .select("company")
      .lean()
      .exec();

    if (!mongoose.Types.ObjectId.isValid(department)) {
      await createLog(
        path,
        action,
        "Invalid department ID provided",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "Invalid department ID provided" });
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
      await createLog(
        path,
        action,
        "Department not found in any company",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(404)
        .json({ message: "Department not found in any company" });
    }

    await createLog(
      path,
      action,
      "New issue added successfully",
      "Success",
      user,
      ip,
      company,
      null,
      { title, priority, department }
    );

    return res.status(201).json({ message: "New issue added successfully" });
  } catch (error) {
    next(error);
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
