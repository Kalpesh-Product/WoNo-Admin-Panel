const mongoose = require("mongoose");

const assignRequestSchema = new mongoose.Schema({
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
    enum: ["Approve", "Reject"],
  },
  assignType: {
    type: String,
    enum: ["Rental", "Company owned"],
  },
});

const AssignRequest = mongoose.model("AssignRequest", assignRequestSchema);
module.exports = AssignRequest;
