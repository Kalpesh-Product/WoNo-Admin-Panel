const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  building: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Building",
  },
  unitName: String,
  unitNo: String,
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Unit = mongoose.model("Unit", unitSchema);
module.exports = Unit;
