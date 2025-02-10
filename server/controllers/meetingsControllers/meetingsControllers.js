const Meeting = require("../../models/meetings/Meetings");
const ExternalClient = require("../../models/meetings/ExternalClients");
const User = require("../../models/UserData");
const { default: mongoose } = require("mongoose");
const Room = require("../../models/meetings/Rooms");
const {
  formatDate,
  formatTime,
  formatDuration,
} = require("../../utils/formatDateTime");
const Department = require("../../models/Departments");
 
const addMeetings = async (req, res, next) => {
  try {
    const {
      meetingType,
      bookedRoom,
      startDate,
      endDate,
      startTime,
      endTime,
      subject,
      agenda,
      internalParticipants,
      externalParticipants,
      externalCompanyData,
    } = req.body;

    const user = req.userData.userId;
    const company = req.userData.company;

    if (
      !meetingType ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !subject ||
      !agenda
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookedRoom)) {
      return res.status(400).json({ message: "Invalid Room Id provided" });
    }

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const startTimeObj = new Date(startTime)
    const endTimeObj = new Date(endTime)

    if(isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime()) || isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())){
      return res.status(400).json({ message: "Invalid date format" });
    }

    const roomAvailable = await Room.findById({
      _id: bookedRoom,
      "location.status": "Available",
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

      participants = users.map((user) => user._id);
    } else if (externalCompanyData) {
      const {
        companyName,
        // registeredCompanyName,
        companyURL,
        email,
        mobileNumber,
        gstNumber,
        panNumber,
        address,
        personName,
      } = externalCompanyData;

      if (!companyName || !email || !mobileNumber || !personName) {
        return res.status(400).json({
          message: "Missing required fields for external participants",
        });
      }

      const newExternalClient = new ExternalClient({
        companyName,
        // registeredCompanyName,
        companyURL,
        email,
        mobileNumber,
        gstNumber: gstNumber,
        panNumber: panNumber,
        address: address || "",
        personName,
      });

      await newExternalClient.save();
    }

    const conflictingMeeting = await Meeting.findOne({
      bookedRoom: roomAvailable._id,
      $or: [{ startDate: { $lte: endDateObj }, endDate: { $gte: startDateObj } }],
      $and: [
        { startTime: { $lte: endTimeObj } },
        { endTime: { $gte: startTimeObj } },
      ],
    });

    if (conflictingMeeting) {
      return res.status(409).json({
        message: "Room is already booked for the specified time",
      });
    }
 
    const meeting = new Meeting({
      meetingType,
      bookedBy: user,
      startDate: startDateObj,
      endDate: endDateObj,
      startTime: startTimeObj,
      endTime: endTimeObj,
      bookedRoom: roomAvailable._id,
      subject,
      agenda,
      company,
      internalParticipants: internalParticipants ? participants : [],
      externalParticipants: externalParticipants ? externalParticipants : [],
    });

    await meeting.save();

    // Update room status to "Booked"
    roomAvailable.location.status = "Occupied";
    await roomAvailable.save();

    res.status(201).json({
      message: "Meeting added successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getMeetings = async (req, res, next) => {
  try {
    const company = req.userData.company;
    const user = req.userData.userId;

    const meetings = await Meeting.find({ company }).populate([
      {
        path: "bookedBy",
        select: "name departments", 
      },
      {
        path: "bookedRoom",
        select: "name",  
      },
      {
        path: "internalParticipants",
        select: "name",  
      },
      
    ]);


    const departments = await User.findById({_id:user}).select("departments")

    const department = await Department.findById({_id:departments.departments[0]})
 
    const internalParticipants =  meetings.map((meeting)=> meeting.internalParticipants.map((participants)=>participants.name))

    if (!meetings) {
      return res.status(400).json({ message: "No meetings found" });
    }

    const transformedMeetings = meetings.map((meeting,index) => {
      return {
        name: meeting.bookedBy.name,
        department: department.name,
        roomName: meeting.bookedRoom.name,
        date: formatDate(meeting.startDate),
        startTime: formatTime(meeting.startTime),
        endTime: formatTime(meeting.endTime),
        credits: meeting.credits,
        duration: formatDuration(meeting.startTime, meeting.endTime),
        status: meeting.status,
        action: meeting.extend,
        agenda: meeting.agenda,
        subject: meeting.subject,
        internalParticipants: internalParticipants[index],
        externalParticipants: meeting.externalParticipants,
        company: meeting.company,
      };
    });

    return res.status(200).json(transformedMeetings);
  } catch (error) {
    next(error);
  }
};

module.exports = { addMeetings, getMeetings };
