const mongoose = require("mongoose");

const subModuleSchema = new mongoose.Schema({
  moduleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Module",
    required: true,
  },
  subModuleTitle: {
    type: String,
    required: true,
  },
});

const SubModule = mongoose.model("SubModule", subModuleSchema);

module.exports = SubModule;
