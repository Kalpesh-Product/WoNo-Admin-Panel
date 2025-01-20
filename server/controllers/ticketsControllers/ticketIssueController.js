const mongoose = require("mongoose");
const TicketIssues = require("../../models/tickets/TicketIssues");
const Department = require("../../models/Departments");

const addTicketIssue = async (req, res, next) => {
  try {
    const { title, department, priority } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(department)) {
      return res
        .status(400)
        .json({ message: "Invalid department ID provided" });
    }

    const newTicketIssue = new TicketIssues({
      title,
      department,
      priority,
    });

    await newTicketIssue.save();

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

    const departmentExists = await Department.findOne({ _id: department })
      .lean()
      .exec();

    if (!departmentExists) {
      return res.status(400).json({ message: "Department doesn't exists" });
    }

    const ticketIssues = await TicketIssues.find({
      department: { $in: [department] },
    })
      .lean()
      .exec();

    if (ticketIssues.length === 0) {
      return res.status(204).send();
    }
 
    return res.status(200).json({ data: ticketIssues });
  } catch (error) {
    next(error);
  }
};

module.exports = { addTicketIssue, getTicketIssue };
