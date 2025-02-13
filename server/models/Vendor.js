const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    state: { type: String, required: true },
    country: { type: String, required: true },
    panItNo: { type: String, required: true, unique: true },
    gstUin: { type: String, required: true, unique: true },
    registrationType: { type: String, required: true },
    assesseeOfOtherTerritory: { type: Boolean, default: false },
    isEcommerceOperator: { type: Boolean, default: false },
    isDeemedExporter: { type: Boolean, default: false },
    partyType: { type: String, required: true },
    gstinUin: { type: String, required: true, unique: true },
    isTransporter: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
