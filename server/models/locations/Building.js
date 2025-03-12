const mongoose = require("mongoose");

const buildingSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  name: String,
  fullAddress: String,
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Building = mongoose.model("Building", buildingSchema);
module.exports = Building;
