const mongoose = require("mongoose");

const deskBookingSchema = new mongoose.Schema(
  {
    desks: {
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
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

const DeskBooking = mongoose.model("DeskBooking", deskBookingSchema);
module.exports = DeskBooking;
