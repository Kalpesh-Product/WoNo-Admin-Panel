const mongoose = require("mongoose");

const ticketIssuesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Low",
  },
});

const TicketIssues = mongoose.model("TicketIssue", ticketIssuesSchema);
module.exports = TicketIssues;
