const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  roleTitle: {
    type: String, 
    required: true,
  },
  roleId: {
    type: String, 
    required: true,
  },

});


const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
