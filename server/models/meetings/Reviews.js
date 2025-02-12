const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
    },
    meeting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meeting",
    },
    review: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      required: true,
    },
    reply: {
      replier: {
        type: mongoose.Schema.Types.ObjectId,
      ref: "UserData",
      },
      text: {
        type:String
      }
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
