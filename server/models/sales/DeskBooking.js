const mongoose = require("mongoose");

const deskBookingSchema = new mongoose.Schema(
  {
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    month: {
      type: Date,
      required: true,
    },
    bookedSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
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

const DeskBooking = mongoose.model("DeskBooking", deskBookingSchema);
module.exports = DeskBooking;
