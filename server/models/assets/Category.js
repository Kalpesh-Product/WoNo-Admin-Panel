const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  subCategories: [
    {
      name: {
      type: String,
    },
    assets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Asset",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    }
  }
  ]
});

const assetCategory = mongoose.model("AssetCategory", categorySchema);
module.exports = assetCategory;
