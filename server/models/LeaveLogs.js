
const mongoose = require("mongoose");

const LeaveLogSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Leave",
    },
    action: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      required: true,
    },
    changes: {
      type: Object,
      default: {},
    },
    remarks: {
      type: String,
    },
    ipAddress:{
        type: String,
        required: true,
    },
    status: {
        type: String,
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
      },
  },
  { timestamps: true }
);

const LeaveLog = mongoose.model("LeaveLog", LeaveLogSchema);
module.exports = LeaveLog;
