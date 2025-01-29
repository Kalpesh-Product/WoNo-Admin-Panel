const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    inTime: {
      type: Date,
      required: true
    },
    outTime: {
      type: Date,
      required: true,
    },
    breakHours: {
      type: Number,
      required: true,
    },
    entryType: {
      type: String,
      required: true,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
  },
  {
    timestamps: true,  
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
module.exports = Attendance;
