const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true,
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
  },
  endTime: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
  status: {
    type: String,
    required: true,
  },
  participants: [
    {
      email: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      isAttending: {
        type: Boolean,
        default: false,
      },
    },
  ],
  externalParticipants: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      },
      isAttending: {
        type: Boolean,
        default: false,
      },
    },
  ],
  addOnAssets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
  ],
  extendedDate: {
    type: Date,
  },
  extendedTime: {
    type: String,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/,
  },
  cancelled: {
    isCancelled: {
      type: Boolean,
      default: false,
    },
    reason: {
      type: String,
    },
  },
});

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
