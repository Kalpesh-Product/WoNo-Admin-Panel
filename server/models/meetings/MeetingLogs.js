const mongoose = require("mongoose");

const meetingLogSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
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

const MeetingLog = mongoose.model("MeetingLog", meetingLogSchema);
module.exports = MeetingLog;
