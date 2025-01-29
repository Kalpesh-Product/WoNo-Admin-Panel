const mongoose = require("mongoose");

const roleDetailsSchema = new mongoose.Schema({
  roleTitle: {
    type: String, 
    required: true,
  }
});


const RoleDetails = mongoose.model("RoleDetails", roleDetailsSchema);

module.exports = RoleDetails;
