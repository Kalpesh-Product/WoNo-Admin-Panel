const mongoose = require("mongoose");
const Company = require("../../models/Company");

const addTicketIssue = async (req, res, next) => {
  try {
    const { title, department, priority = "Low" } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res
        .status(400)
        .json({ message: "Invalid department ID provided" });
    }

    // Find the company containing the department
    const company = await Company.findOne({
      "selectedDepartments.department": department,
    });

    if (!company) {
      return res
        .status(404)
        .json({ message: "Department not found in any company" });
    }

    // Find the correct department inside the selectedDepartments array
    const departmentIndex = company.selectedDepartments.findIndex(
      (dept) => dept.department.toString() === department
    );

    if (departmentIndex === -1) {
      return res
        .status(404)
        .json({ message: "Department not found in the company" });
    }

    // Add the new ticket issue
    company.selectedDepartments[departmentIndex].ticketIssues.push({
      title,
      priority,
    });

    // Save the updated document
    await company.save();

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

    // Find the company containing the department
    const company = await Company.findOne(
      { "selectedDepartments.department": department },
      { selectedDepartments: 1 } // Fetch only the selectedDepartments array
    ).lean();

    if (!company) {
      return res
        .status(404)
        .json({ message: "Department not found in any company" });
    }

    // Find the correct department inside selectedDepartments
    const departmentData = company.selectedDepartments.find(
      (dept) => dept.department.toString() === department
    );

    if (!departmentData) {
      return res
        .status(404)
        .json({ message: "Department not found in the company" });
    }

    const ticketIssues = departmentData.ticketIssues || [];

    if (ticketIssues.length === 0) {
      return res.status(204).send();
    }

    return res.status(200).json(ticketIssues);
  } catch (error) {
    next(error);
  }
};

module.exports = { addTicketIssue, getTicketIssue };
