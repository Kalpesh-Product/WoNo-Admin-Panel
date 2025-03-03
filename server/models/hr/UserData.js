const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  empId: {
    type: String,
  },
  firstName: {
    type: String,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dateOfBirth: {
    type: Date,
  },
  phone: {
    type: String,
    minlength: 7,
    maxlength: 20,
  },
  email: {
    type: String,
    unique: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  departments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  password: String,
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
  qualification: {
    type: String,
  },
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
  },
  workLocation: {
    type: String,
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  refreshToken: String,
  dateOfExit: Date,

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
    pfContributionRate: { type: String },
    employeePF: { type: String },
  },
  familyInformation: {
    fatherName: { type: String },
    motherName: { type: String },
    maritalStatus: { type: String },
  },
  isActive: {
    type: Boolean,
    default: false,
  },
});

const UserData = mongoose.model("UserData", userDataSchema);
module.exports = UserData;
