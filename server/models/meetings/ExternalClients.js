const mongoose = require("mongoose");

const externalCompanySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    registeredCompanyName: {
      type: String,
    },
    companyURL: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
    },
    panNumber: {
      type: String,
    },
    address: {
      type: String,
    },
    personName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ExternalCompany = mongoose.model(
  "ExternalCompany",
  externalCompanySchema
);
module.exports = ExternalCompany;
