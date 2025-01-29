const mongoose = require("mongoose");

// Define the Company schema
const companySchema = new mongoose.Schema({
  companyId: {
    type: String,
    required: true,
    unique: true,
  },
  selectedDepartments: [
    {
      department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
      admin: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserData",
        },
      ],
    },
  ],
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
  employeeType: [
    {
      name: {
        type: String,
      },
      status: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

// Define the Company model
const Company = mongoose.model("Company", companySchema);

module.exports = Company;
