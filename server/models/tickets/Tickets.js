const mongoose = require("mongoose");

const ticketsSchema = new mongoose.Schema(
  {
    ticket: {
      type: String,
      required: true,
    },
    raisedToDepartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
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
        ref: "UserData",
      },
    ],
    accepted: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
    resolvedDate: Date,
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketsSchema);
module.exports = Ticket;
