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
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
    },
    leavePeriod: {
      type: String,
      required: true,
    },
    hours: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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
    timestamps: true,  
  }
);

const Leave = mongoose.model("Leave", leaveSchema);
module.exports = Leave;
