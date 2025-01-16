const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketIssue",
    },
    raisedToDepartment:{
     type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
     },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    accepted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedDate: Date,
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketsSchema);
module.exports = Ticket;
