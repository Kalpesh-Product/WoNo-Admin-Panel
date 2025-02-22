
const mongoose = require("mongoose");

const attendanceLogSchema = new mongoose.Schema({
  sourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendance",
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
  ipAddress: {
    type: String,
  },
  remarks: {
    type: String,
  },
  status: {
    type: String,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
});

const AttendanceLog = mongoose.model("AttendanceLog", attendanceLogSchema);
module.exports = AttendanceLog;
