const Meeting = require("../../models/meetings/Meetings");
const ExternalClient = require("../../models/meetings/ExternalClients");
const User = require("../../models/UserData");
const { default: mongoose } = require("mongoose");
const Room = require("../../models/meetings/Rooms");
const { formatDate, formatTime, formatDuration } = require("../../utils/formatDateTime");
const { differenceInMinutes } = require("date-fns/differenceInMinutes");
 
const addMeetings = async (req, res, next) => {
  try {
  
    const {
      meetingType,
      bookedRoom,
      startDate,
      endDate,
      startTime,
      endTime,
      agenda,
      internalParticipants,
      externalParticipants,
    } = req.body;

    const user = req.userData;  
    const company = req.userData.company;  

    if (!meetingType || !startDate || !endDate || !startTime || !endTime || !agenda) {
      return res.status(400).json({ message: "Missing required fields" });
    }
 
    if(!mongoose.Types.ObjectId.isValid(bookedRoom)){
      return res.status(400).json({ message: "Invalid Room Id provided" });
    }

    const roomAvailable = await Room.findById({_id: bookedRoom,"location.status":"Available"});

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
          registeredCompanyName: registeredCompanyName,
          companyURL: companyURL,
          email,
          mobileNumber,
          gstNumber: gstNumber,
          panNumber: panNumber,
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

    console.log(conflictingMeeting)

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
      agenda,
      company,
      internalParticipants: internalParticipants ? participants : [],  
      externalParticipants: externalParticipants ? participants : [],  
    });

   await meeting.save();

    // Update room status to "Booked"
    roomAvailable.location.status = "Unavailable";
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

    const meetings = await Meeting.find({company}).populate({path:"bookedRoom", select:"name"})

    if(!meetings){
      return res.status(400).json({message:"No meetings found"})
    }

    const transformedMeetings = meetings.map((meeting)=>{

      return {
        roomName:meeting.bookedRoom.name,
        date: formatDate(meeting.startDate),
        startTime: formatTime(meeting.startTime),
        endTime: formatTime(meeting.endTime),
        credits: meeting.credits,
        duration: formatDuration(meeting.startTime, meeting.endTime),
        status: meeting.status,
        action: meeting.extend,
        agenda: meeting.agenda,
        internalParticipants: meeting.internalParticipants,
        externalParticipants: meeting.externalParticipants,
        company:meeting.company,

      }
    })
 
    return res.status(200).json(transformedMeetings)
    
  } catch (error) {
    next(error)
  }
}


module.exports = { addMeetings, getMeetings };
