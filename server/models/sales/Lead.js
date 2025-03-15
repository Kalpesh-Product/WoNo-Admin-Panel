const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    dateOfContact: {
      type: Date,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    serviceCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientService",
    },
    leadStatus: {
      type: String,
      required: true,
    },
    proposedLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    sector: {
      type: String,
      required: true,
    },
    headOfficeLocation: {
      type: String,
      required: true,
    },
    officeInGoa: {
      type: Boolean,
      required: true,
    },
    pocName: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
    },
    leadSource: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    openDesks: {
      type: Number,
      required: true,
    },
    cabinDesks: {
      type: Number,
      required: true,
    },
    totalDesks: {
      type: Number,
      required: true,
    },
    clientBudget: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    remarksComments: {
      type: String,
    },
    lastFollowUpDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
