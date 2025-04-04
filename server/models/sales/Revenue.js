const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema(
  {
    actualRevenue: {
      type: String,
    },
    projectedRevenue: {
      type: String,
      required: true,
    },
    month: {
      type: Date,
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoworkingClient",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientService",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

const Revenue = mongoose.model("Revenue", revenueSchema);
module.exports = Revenue;
