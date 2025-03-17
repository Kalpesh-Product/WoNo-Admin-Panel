const mongoose = require("mongoose");

const deskDataSchema = new mongoose.Schema(
  {
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

const DeskData = mongoose.model("DeskData", deskDataSchema);
module.exports = DeskData;
