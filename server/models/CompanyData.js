const mongoose = require("mongoose");

const companyDataSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  companySize: {
    type: String,
    required: true,
  },
  companyType: {
    type: String,
    required: true,
  },
  companyCity: {
    type: String,
    required: true,
  },
  companyState: {
    type: String,
    required: true,
  },
  websiteURL: {
    type: String,
  },
  linkedinURL: {
    type: String,
  },
});

const CompanyData = mongoose.model("CompanyData", companyDataSchema);
module.exports = CompanyData;
