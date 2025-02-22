

const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
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

const UserLog = mongoose.model("UserLog", userLogSchema);
module.exports = UserLog;
