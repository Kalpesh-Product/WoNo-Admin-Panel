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
     raisedBy:{
      type: mongoose.Schema.Types.ObjectId,
       ref: "User",
      },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Closed"],
      default: "Pending",
    },
    escalatedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
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
