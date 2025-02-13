const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    minlength: 7,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  assignedAsset: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
  ],
  subordinates: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  employeeType: {
    name: {
      type: String,
    },
    leavesCount: [
      {
        leaveType: {
          type: String,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  designation: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  workLocation: {
    type: String,
    required: true,
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  assetDescription: {
    type: String,
  },
  refreshToken: String,

  // New fields added
  policies: {
    shift: { type: String, required: true },
    workSchedulePolicy: { type: String, required: true },
    attendanceSource: { type: String },
    leavePolicy: { type: String },
    holidayPolicy: { type: String },
  },
  homeAddress: {
    addressLine1: { type: String },
    addressLine2: { type: String },
    city: { type: String },
    state: { type: String },
    pinCode: { type: String },
    notes: { type: String },
  },
  bankInformation: {
    bankIFSC: { type: String },
    bankName: { type: String },
    branchName: { type: String },
    nameOnAccount: { type: String },
    accountNumber: { type: String },
  },
  panAadhaarDetails: {
    aadhaarId: { type: String },
    pan: { type: String },
    pfAccountNumber: { type: String },
    pfUAN: { type: String },
    esiAccountNumber: { type: String },
  },
  payrollInformation: {
    includeInPayroll: { type: Boolean },
    payrollBatch: { type: String },
    professionTaxExemption: { type: Boolean },
    includePF: { type: Boolean },
    pfContributionRate: { type: Number },
    employeePF: { type: Number },
  },
  familyInformation: {
    fatherName: { type: String },
    motherName: { type: String },
    maritalStatus: { type: String },
  },
});

const UserData = mongoose.model("UserData", userDataSchema);
module.exports = UserData;
