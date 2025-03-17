const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    clientName: {
      type: String,
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    sector: {
      type: String,
      required: true,
    },
    hoCity: {
      type: String,
      required: true,
    },
    hoState: {
      type: String,
      required: true,
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
      required: true,
    },
    ratePerDesk: {
      type: Number,
      required: true,
    },
    annualIncrement: {
      type: Number,
      required: true,
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
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    lockinPeriod: {
      type: Number,
      required: true,
    },
    rentDate: { type: Date, required: true },
    nextIncrement: {
      type: Date,
      required: true,
    },
    localPoc: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
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
        required: true,
      },
      email: {
        type: String,
        required: true,
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

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
