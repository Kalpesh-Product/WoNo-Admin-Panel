const mongoose = require("mongoose");


const moduleSchema = new mongoose.Schema({
    moduleTitle: {
      type: String,
      required: true,
    },
    subModules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubModule",
      },
    ],
  });
  
  const Module = mongoose.model("Module", moduleSchema);
  
  module.exports =  Module ;
  