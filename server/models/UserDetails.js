const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    unique: true,
  },
  company: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyData",
        required: true, 
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
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyData",
  },
 familyDetails:{
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
 },
  addressDetails: {
    address1: {
      type: String,
    },
    address2: {
      type: String,
    },
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
    pin: {
      type: String,
    },
    notes: {
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
    pfUan: {
      type: String,
    },
    pfAccountNumber: {
      type: String,
    },
    esiAccountNumber: {
      type: String,
    },
  },
  policyDetails: {
    shift: {
      type: String,
    },
    workSchedulePolicy: {
      type: String,
      required:true
    },
    leavePolicy: {
      type: String,
    },
    holidayPolicy: {
      type: String,
      required:true
    },
    attendanceSource: {
      type: String,
      default: "TimeClock",
      required:true
    },
  },
  bankDetails: {
    ifsc: {
      type: String,
    },
    bankName: {
      type: String,
    },
    branchName: {
      type: String,
    },
    nameOnAccount: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
  },
  payrollDetails: {
    IncludeInpayroll: {
      type: String,
    },
    payrollBatch: {
      type: String,
    },
    professionTaxExemption: {
      type: String,
    },
    includePf: {
      type: String,
    },
    pfContributionRate: {
      type: String,
    },
    EmployeePf: {
      type: String,
    },
  },
  jobDetails:{
    workLocation: {
      type: String,
    },
    jobDescription: {
      type: String,
    },
    assetDescription: {
      type: String,
    },
    employeeType: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    workPolicy: {
      type: String,
    },
    reportsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    department: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],
    jobTitle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designation",
    },
  },
  selectedServices: [
    {
      type: String,
    },
  ],
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

const UserDetails = mongoose.model("UserDetail", userDetailsSchema);
module.exports = UserDetails;