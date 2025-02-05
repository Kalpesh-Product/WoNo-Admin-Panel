const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true,
  },
  roomLocation: {
    name: {
      type: String,
    },
    status: {
      type: Boolean,
      default: "Available",
      enum: ["Available", "Unavailable"]
    },
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  name: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1462826303086-329426d1aef5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    id: String,
  },
  meetingStatus: {
    type: String,
    default: "Available",
  },
  assignedAssets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
    },
  ],
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  location: String,
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;
