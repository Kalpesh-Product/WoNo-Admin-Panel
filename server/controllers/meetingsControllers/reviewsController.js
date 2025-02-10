const Review = require("../../models/meetings/Reviews");
const Meeting = require("../../models/meetings/Meetings");

// Add a Review
const addReview = async (req, res, next) => {
  try {
    const { meetingId, review, rate } = req.body;
    const userId = req.user; // Authenticated user

    // Validate inputs
    if (!meetingId || !review || !rate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rate < 1 || rate > 5) {
      return res.status(400).json({ message: "Rate must be between 1 and 5" });
    }

    // Check if the user booked the meeting
    const meeting = await Meeting.findOne({
      _id: meetingId,
      bookedBy: userId,
    })
      .lean()
      .exec();

    if (!meeting) {
      return res.status(403).json({
        message: "You can only review meetings that you have booked.",
      });
    }

    // Create and save the review
    const newReview = new Review({
      user: userId,
      review,
      rate,
      meeting: meetingId,
    });

    const savedReview = await newReview.save();

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    next(error);
  }
};

// Get Reviews
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Update a Review
const updateReview = async (req, res, next) => {
  try {
    const { reviewId, review, rate } = req.body;
    const userId = req.user; // Authenticated user

    // Validate inputs
    if (!reviewId || !review || !rate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (rate < 1 || rate > 5) {
      return res.status(400).json({ message: "Rate must be between 1 and 5" });
    }

    // Find and update the review
    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, user: userId }, // Ensure the user is the owner of the review
      { review, rate },
      { new: true }
    );

    if (!updatedReview) {
      return res
        .status(404)
        .json({ message: "Review not found or unauthorized" });
    }

    res.status(200).json({
      message: "Review updated successfully",
      review: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addReview,
  getReviews,
  updateReview,
};
