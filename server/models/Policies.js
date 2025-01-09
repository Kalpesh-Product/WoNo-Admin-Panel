const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    policyId: {
      type: String,
      default: "S-001",
    },
    policyName: {
      type: String,
      default: "",
    },
    policyDepartment: {
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
    timestamps: true, // Enable timestamps
  }
);

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
