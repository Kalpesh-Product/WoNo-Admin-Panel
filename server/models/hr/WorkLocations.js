const mongoose = require("mongoose");
const workLocationSchema = new mongoose.Schema({
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
  occupiedImage: {
    id: String,
    url: String,
  },
  clearImage: {
    id: String,
    url: String,
  },
  unit: {
    unitNo: String,
    unitName: String,
  },
});

const WorkLocations = mongoose.model("WorkLocation", workLocationSchema);
module.exports = WorkLocations;
