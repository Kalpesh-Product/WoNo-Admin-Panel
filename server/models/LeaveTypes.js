const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
  {
    leaveTypeId: {
      type: String,
      default: "LT-001",
    },
    leaveType: {
      type: String,
      default: "",
    },

    noOfDays: {
      type: Number,
      default: 3,
    },
    deletedStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Enable timestamps
  }
);

const LeaveType = mongoose.model("LeaveType", leaveTypeSchema);
module.exports = LeaveType;
