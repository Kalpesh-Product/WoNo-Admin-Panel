const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  empId: {
    type: String,
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

  role: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
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
    minlength: 7,
    maxlength: 20,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
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
  employmentType: {
    type: String,
  },
  designation: String,
  refreshToken: String,
});

const UserData = mongoose.model("UserData", userDataSchema);
module.exports = UserData;
