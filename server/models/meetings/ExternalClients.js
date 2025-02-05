const mongoose = require("mongoose");

const externalClientSchema = new mongoose.Schema(
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

const ExternalClient = mongoose.model("ExternalClient", externalClientSchema);
module.exports = ExternalClient;
