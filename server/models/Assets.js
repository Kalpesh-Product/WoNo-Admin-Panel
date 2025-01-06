const mongoose = require("mongoose");

const assetsSchema = new mongoose.Schema({
  assetNumber: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  department: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  ],
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  purchaseDate: {
    type: Date,
  },
  invoice: {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    invoiceUrl: {
      type: String,
      required: true,
    },
  },
  vendor: {
    type: String,
    required: true,
  },
  warranty: {
    type: String,
    required: true,
  },
  location: {
    mainLocation: {
      type: String,
      required: true,
    },
    subLocation: {
      type: String,
      required: true,
    },
  },
  status: {
    type: String,
    required: true,
  },
});

const Asset = mongoose.model("Asset", assetsSchema);
module.exports = Asset;
