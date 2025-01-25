const mongoose = require("mongoose");

const policySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,  
    }    
  },
  {
    timestamps: true,  
  }
);

const Policy = mongoose.model("Policy", policySchema);
module.exports = Policy;
