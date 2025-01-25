const mongoose = require("mongoose");

const workLocationSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required:true
    },
    status:{
      type: Boolean,
      default: "Active",
    },
  },
);

const WorkLocation = mongoose.model("WorkLocation", workLocationSchema);
module.exports = WorkLocation;
