const Meeting = require("../../models/meetings/Meetings");
const ExternalClient = require("../../models/meetings/ExternalClients");
const User = require("../../models/User");
const Room = require("../../models/User");
 
const addMeetings = async (req, res, next) => {
  try {
    const {
      meetingType,
      location,
      startDate,
      endDate,
      startTime,
      endTime,
      status,
      internalParticipants,
      externalParticipants,
    } = req.body;

    const user = req.userData;  

    if (!location || !startDate || !endDate || !startTime || !endTime || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
 
    const roomAvailable = await Room.findOne({
      "roomLocation.name": location,
      "roomLocation.status": "Available",
    });

    if (!roomAvailable) {
      return res.status(404).json({ message: "Room is unavailable" });
    }

    let participants = [];  

    if (internalParticipants) {
      const invalidIds = internalParticipants.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidIds.length > 0) {
        return res.status(400).json({
          message: "Invalid internal participant IDs",
          invalidIds,
        });
      }

      const users = await User.find({ _id: { $in: internalParticipants } });

      const unmatchedIds = internalParticipants.filter(
        (id) => !users.find((user) => user._id.toString() === id)
      );

      if (unmatchedIds.length > 0) {
        return res.status(400).json({
          message: "Some internal participant IDs did not match any user",
          unmatchedIds,
        });
      }

      participants = users.map((user) => user._id); // Extract valid IDs
    } else if (externalParticipants) {
       
      for (const participant of externalParticipants) {
        const {
          companyName,
          registeredCompanyName,
          companyURL,
          email,
          mobileNumber,
          gstNumber,
          panNumber,
          address,
          personName,
        } = participant;

        if (!companyName || !email || !mobileNumber || !personName) {
          return res.status(400).json({
            message: "Missing required fields for external participants",
          });
        }

        const newExternalClient = new ExternalClient({
          companyName,
          registeredCompanyName: registeredCompanyName || "",
          companyURL: companyURL || "",
          email,
          mobileNumber,
          gstNumber: gstNumber || "",
          panNumber: panNumber || "",
          address: address || "",
          personName,
        });

        const savedExternalClient = await newExternalClient.save();
        participants.push(savedExternalClient._id);  
      }
    }
 
    const conflictingMeeting = await Meeting.findOne({
      bookedRoom: roomAvailable._id,
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      ],
      $and: [
        { startTime: { $lte: endTime } },
        { endTime: { $gte: startTime } },
      ],
    });

    if (conflictingMeeting) {
      return res.status(409).json({
        message: "Room is already booked for the specified time",
      });
    }
 
    const meeting = new Meeting({
      meetingType,
      bookedBy: user._id,
      startDate,
      endDate,
      startTime,
      endTime,
      bookedRoom: roomAvailable._id,
      status,
      location,
      participants, // Includes either internal or external participant IDs
    });

    const savedMeeting = await meeting.save();

    // Update room status to "Booked"
    roomAvailable.roomLocation.status = "Booked";
    await roomAvailable.save();

    res.status(201).json({
      message: "Meeting added successfully"
    });
  } catch (error) {
    console.error("Error adding meeting:", error);
    next(error);
  }
};


const getMeetings = async (req,res,next) => {

  try {
 
    const company = req.userData.company

    const meetings = await Meeting.find({company})

    if(!meetings){
      return res.status(400).json({message:"No meetings found"})
    }

    return res.status(200).json(meetings)
    
  } catch (error) {
    next(error)
  }
}


module.exports = { addMeetings, getMeetings };
