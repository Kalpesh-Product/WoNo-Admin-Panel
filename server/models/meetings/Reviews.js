const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
  review: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  }
}, 
{ timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
