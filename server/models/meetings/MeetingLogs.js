const mongoose = require("mongoose");

const meetingLogSchema = new mongoose.Schema(
  {
    meetingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
      required: true,
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
    }
  },
  { timestamps: true }
);

const MeetingLog = mongoose.model("MeetingLog", meetingLogSchema);
module.exports = MeetingLog;
