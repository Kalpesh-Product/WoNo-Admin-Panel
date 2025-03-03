const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
  ],
  description: {
    type: String,
    required: true,
  },
  assignedDate: {
    type: Date,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  dueTime: {
    type: Date,
    default: null,
    // match: /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
  },
  status: {
    type: String,
    required: true,
    enum: ["Completed", "Pending"],
  },
  priority: {
    type: String,
    required: true,
  },
  taskType: {
    type: String,
    enum: ["Daily", "Monthly", "Additional"],
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
