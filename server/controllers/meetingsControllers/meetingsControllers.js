const Meeting = require("../../models/Meetings");
const User = require("../../models/User");
const Room = require("../../models/User");
const idGenerator = require("../../utils/idGenerator");

const addMeetings = async (req, res, next) => {
  try {
    const {
      bookedBy,
      startDate,
      endDate,
      startTime,
      endTime,
      roomId,
      status,
      participants,
      externalParticipants,
    } = req.body;

    // Validate the user reference
    const user = await User.findById(bookedBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const meetingId = idGenerator("M");

    // Validate the room reference
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Find users by their emails
    const users = await User.find({ email: { $in: participants } });
    const userIds = users.map((user) => user._id);

    // Check for any emails that did not match a user
    const unmatchedEmails = participants.filter(
      (email) => !users.find((user) => user.email === email)
    );

    if (unmatchedEmails.length > 0) {
      console.warn("Some emails did not match any user:", unmatchedEmails);
    }

    // Create the meeting
    const meeting = new Meeting({
      meetingId,
      bookedBy: user._id,
      startDate,
      endDate,
      startTime,
      endTime,
      roomId: room._id,
      status,
      participants: userIds,
      externalParticipants: externalParticipants || [],
      addOnAssets: [],
    });

    const savedMeeting = await meeting.save();

    res.status(201).json({
      message: "Meeting added successfully",
      meeting: savedMeeting,
      unmatchedEmails,
    });
  } catch (error) {
    console.error("Error adding meeting:", error);
    next(error);
  }
};

module.exports = { addMeetings };
