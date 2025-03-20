const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    clientName: {
      type: String
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClientService",
    },
    sector: {
      type: String
    },
    hoCity: {
      type: String
    },
    hoState: {
      type: String
    },
    unit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Unit",
    },
    cabinDesks: {
      type: Number,
      default: 0,
    },
    openDesks: {
      type: Number,
      default: 0,
    },
    totalDesks: {
      type: Number,
    },
    ratePerDesk: {
      type: Number
    },
    annualIncrement: {
      type: Number,
    },
    perDeskMeetingCredits: {
      type: Number,
      default: 0,
    },
    totalMeetingCredits: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    lockinPeriod: {
      type: Number
    },
    clearImage: {
      imageId: String,
      imageUrl: String,
    },
    occupiedImage: {
      imageId: String,
      imageUrl: String,
    },
    bookingType: {
      type: String,
      enum: ["SPV", "Direct"],
    },
    rentDate: { type: Date, required: true },
    nextIncrement: {
      type: Date,
    },
    localPoc: {
      name: {
        type: String,
      },
      email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      phone: {
        type: String,
        minlength: 7,
        maxlength: 20,
        match: [/^\+?[0-9]+$/, "Invalid phone number format"],
      },
    },
    hOPoc: {
      name: {
        type: String,
      },
      email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      phone: {
        type: String,
        minlength: 7,
        maxlength: 20,
        match: [/^\+?[0-9]+$/, "Invalid phone number format"],
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Client = mongoose.model("CoworkingClient", clientSchema);

module.exports = Client;
