const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
    bookedRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    meetingType: {
      type: String,
      enum: ["Internal", "External"],
      required: true,
    },
    internalParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
      },
    ],
    externalParticipants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ExternalClient",
      },
    ],
    agenda: {
      type: String,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Meeting = mongoose.model("Meeting", meetingSchema);
module.exports = Meeting;
