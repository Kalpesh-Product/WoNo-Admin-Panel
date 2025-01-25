const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },

  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  dob: {
    type: Date,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role", 
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  fatherOccupation: {
    type: String,
  },
  motherOccupation: {
    type: String,
  },
  maritalStatus: {
    type: String,
  },
  spouseName: {
    type: String,
  },
  spouseOccupation: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
    match: /^[+]?[\d\s\-()]{7,20}$/,
    minlength: 7,
    maxlength: 20,
  },
  reportsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  address: {
    street: {
      type: String,
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    zip: {
      type: String,
    },
  },
  kycDetails: {
    aadhaar: {
      type: String,
    },
    pan: {
      type: String,
    },
  },
  bankDetails: {
    bankName: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    ifsc: {
      type: String,
    },
  },
  workLocation: {
    type: String,
  },
  workType: {
    type: String,
  },
  employeeType: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  shift: {
    type: String,
  },
  workPolicy: {
    type: String,
  },
  attendanceSource: {
    type: String,
    default: "TimeClock",
  },
  pfAccountNumber: {
    type: String,
  },
  esiAccountNumber: {
    type: String,
  },
  selectedServices: [
    {
      type: String,
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyData",
  },
  assignedAsset: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
  ],
  assignedMembers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  refreshToken: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;

