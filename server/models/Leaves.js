const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema(
  {
    leaveId: {
      type: String,
      default: "L-001",
    },
    takenBy: {
      type: String,
      required: true,
      default: "Allan",
    },

    fromDate: {
      type: String,
      default: "2024-12-27",
    },
    toDate: {
      type: String,
      default: "2024-12-27",
    },
    leaveType: {
      type: String,
      default: "Privileged Leave",
    },
    leavePeriod: {
      type: String,
      default: "Single",
    },
    hours: {
      type: String,
      default: "9.00",
    },
    description: {
      type: String,
      default: "Privileged Leave",
    },
    status: {
      type: String,
      default: "Pending",
    },
    approvedBy: {
      type: String,
      default: "N/A",
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
