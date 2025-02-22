const mongoose = require("mongoose");

const companyLogSchema = new mongoose.Schema(
  {
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
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

const CompanyLog = mongoose.model("CompanyLog", companyLogSchema);
module.exports = CompanyLog;
