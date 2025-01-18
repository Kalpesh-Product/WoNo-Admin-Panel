const mongoose = require("mongoose");
const TicketIssues = require("../../models/tickets/TicketIssues");

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

module.exports = { addTicketIssue };
