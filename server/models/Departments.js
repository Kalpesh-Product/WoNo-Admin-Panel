const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  departmentId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyData",
  },
  designations: {
    type: [mongoose.Schema.Types.ObjectId], // Array of strings to hold multiple designations
    ref: "Designation", // Refers to the Designations schema
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId], // Array of ObjectIds
    ref: "User", // Refers to the User schema
  },
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
