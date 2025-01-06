const mongoose = require("mongoose");

const sopSchema = new mongoose.Schema(
  {
    sopId: {
      type: String,
      default: "S-001",
    },
    sopName: {
      type: String,
      default: "",
    },
    sopDepartment: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },

    deletedStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const Sop = mongoose.model("Sop", sopSchema);
module.exports = Sop;
