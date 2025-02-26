const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    expanseName: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    expanseType: {
      type: String,
      enum: ["Internal", "External"],
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Budget = mongoose.model("Budget", budgetSchema);
module.exports = Budget;
