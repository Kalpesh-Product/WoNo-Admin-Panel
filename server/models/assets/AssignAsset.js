const mongoose = require("mongoose");

const assignAsset = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset",
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Rejected"],
  },
  assignType: {
    type: String,
    enum: ["Rental", "Company owned"],
  },
  dateOfAssigning: {
    type: Date,
    required: true,
  },

});

const AssignAsset = mongoose.model("AssignAsset", assignAsset);
module.exports = AssignAsset;
