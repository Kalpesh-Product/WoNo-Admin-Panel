const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  ammount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  utilized: {
    type: Number,
    default: 0,
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RequestBudget",
    },
  ],
  forMonth: {
    type: Date,
    required: true,
  },
});

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
