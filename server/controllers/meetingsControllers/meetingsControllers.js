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
const MeetingLog = require("../../models/meetings/MeetingLogs");
const { createLog } = require("../../utils/moduleLogs");
 
const addMeetings = async (req, res, next) => {
  try {
    const {
      meetingType,
      // bookedBy,
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

    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let errorMessage = ""
    let path = "meetings/MeetingLogs"
    let action = "Book Meeting"

    if (
      !meetingType ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !subject ||
      !agenda
    ) {
      await createLog("meetings/MeetingLogs","Book Meeting", "Missing required fields","Failed",user,ip, company);

      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(bookedRoom)) {
      errorMessage = "Invalid Room Id provided"

      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
    }
    // if (!mongoose.Types.ObjectId.isValid(bookedBy)) {
    //   return res.status(400).json({ message: "Invalid Room Id provided" });
    // }

    // let userExists 
    // if(meetingType === 'Internal'){
    //    userExists = await User.findOne({name:bookedBy})
    // }

    // if(!userExists){
    //   return res.status(400).json({ message: "User not found" });
    // }

    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const startTimeObj = new Date(startTime)
    const endTimeObj = new Date(endTime)

    if(isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime()) || isNaN(startTimeObj.getTime()) || isNaN(endTimeObj.getTime())){

      errorMessage = "Invalid date format"
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
     }

    const roomAvailable = await Room.findById({
      _id: bookedRoom,
      "location.status": "Available",
    });

    if (!roomAvailable) {
      errorMessage = "Room is unavailable"
      await createLog(path, action, errorMessage, user, ip, company);

      return res.status(400).json({ message: errorMessage});
     }

    let participants = [];

    if (internalParticipants) {
      const invalidIds = internalParticipants.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidIds.length > 0) {
        errorMessage = "Invalid internal participant IDs"
        await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
      }

      const users = await User.find({ _id: { $in: internalParticipants } });

      const unmatchedIds = internalParticipants.filter(
        (id) => !users.find((user) => user._id.toString() === id)
      );

      if (unmatchedIds.length > 0) {

        errorMessage = "Some internal participant IDs did not match any user"
        await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
      }

      participants = users.map((user) => user._id);
    } else if (externalCompanyData) {
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
      } = externalCompanyData;

      if (!companyName || !email || !mobileNumber || !personName) {
        errorMessage = "Missing required fields for external participants"
        await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
      }

      const newExternalClient = new ExternalClient({
        companyName,
        registeredCompanyName,
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
      errorMessage = "Room is already booked for the specified time"
      await createLog(path, action, errorMessage, user, ip, company);

        return res.status(400).json({ message: errorMessage});
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

    
    const data = {
      meetingType,
      bookedBy: user,
      bookedRoom: bookedRoom,
      startDate: startDateObj,
      endDate: endDateObj,
      startTime: startTimeObj,
      endTime: endTimeObj,
      subject,
      agenda,
      company,
      internalParticipants,
      externalParticipants,
    }

    await createLog(path, action,"Meeting added successfully and updated room status","Success",user, ip, company,meeting._id,data);

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
        select: "name location housekeepingStatus",  
      },
      {
        path: "internalParticipants",
        select: "name",  
      },
      
    ]);

    const departments = await User.findById({_id:user}).select("departments")

    const department = await Department.findById({_id:departments.departments[0]})
 
    const internalParticipants = meetings.map((meeting) => {
      if (!Array.isArray(meeting.internalParticipants)) {
        return [];
      }
      
      return meetings.map((meeting)=> meeting.internalParticipants.map((participant)=>participant?.name))
    });

     const housekeepingChecklist = [
      {
        name: "Clean and arrange chairs and tables",
      },
      {
        name: "Check projector functionality",
      },
      {
        name: "Ensure AC is working",
      },
      {
        name: "Clean whiteboard and provide markers",
      },
      {
        name: "Vacuum and clean the floor",
      },
      {
        name: "Check lighting and replace bulbs if necessary",
      },
      {
        name: "Ensure Wi-Fi connectivity",
      },
      {
        name: "Stock water bottles and glasses",
      },
      {
        name: "Inspect electrical sockets and outlets",
      },
      {
        name: "Remove any trash or debris",
      },
    ];

    const transformedMeetings = meetings.map((meeting,index) => {
      
      return {
        _id: meeting._id,
        name: meeting.bookedBy.name,
        department: department.name,
        roomName: meeting.bookedRoom.name,
        roomStatus: meeting.bookedRoom.location.status,
        location: meeting.bookedRoom.location.name,
        meetingType: meeting.meetingType,
        housekeepingStatus: meeting.bookedRoom.housekeepingStatus,
        date: formatDate(meeting.startDate),
        startTime: formatTime(meeting.startTime),
        endTime: formatTime(meeting.endTime),
        credits: meeting.credits,
        duration: formatDuration(meeting.startTime, meeting.endTime),
        meetingStatus: meeting.status,
        action: meeting.extend,
        agenda: meeting.agenda,
        subject: meeting.subject,
        housekeepingChecklist:  [...(meeting.housekeepingChecklist ?? [])],
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


const addHousekeepingTask = async (req, res, next) => {

  try {

    const {housekeepingTasks,meetingId,roomName} = req.body 
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let path = "meetings/MeetingLogs"
    let action = "Add housekeeping tasks"

    if(!housekeepingTasks || !meetingId || !roomName){
      await createLog(path, action, "All feilds are required", user, ip, company);
      return res.status(400).json({message:"All feilds are required"})
    }

    if(!mongoose.Types.ObjectId.isValid(meetingId)){
      await createLog(path, action, "Invalid meeting id provided", user, ip, company);
      return res.status(400).json({message:"Invalid meeting id provided"})
    }

    const inCompleteTasks = housekeepingTasks.filter((task) => task.status === "Pending")

    if(inCompleteTasks.length > 0){
      await createLog(path, action, "Please check out the tasks before submitting", user, ip, company);
      return res.status(400).json({message:"Please check out the tasks before submitting"})
    }

    const completedTasks = housekeepingTasks.map((task)=> ({name:task.name}))

    const foundMeeting = await Meeting.findByIdAndUpdate(
      {_id:meetingId},
      { $push: { housekeepingChecklist: completedTasks  }, 
     },
      {new:true}
    )

    const room = await Room.findOneAndUpdate({name:roomName},{housekeepingStatus:"Completed","location.status":"Available"},
      {new:true}
    )


    if(!foundMeeting){
       await createLog(path, action, "Failed to add the housekeeping tasks", user, ip, company);
      return res.status(400).json({message:"Failed to add the housekeeping tasks"})
    }

    if(!room){
       await createLog(path, action, "Failed to update the room status", user, ip, company);
      return res.status(400).json({message:"Failed to update the room status"})
    }

    const meetingLog = new MeetingLog({
      meetingId: meetingId,
      action: "Housekeeping Tasks Added",
      performedBy: req.userData.userId,
      changes: { housekeepingTasks: completedTasks, roomName },
      remarks: "Housekeeping tasks completed and room status updated",
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    await meetingLog.save();

    return res.status(200).json({message: "Housekeeping tasks added successfully"})

  } catch (error) {
    next(error)
  }
}


const deleteHousekeepingTask = async (req, res, next) => {
  try {
    const { housekeepingTask, meetingId } = req.body;
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let path = "meetings/MeetingLogs"
    let action = "Delete housekeeping tasks"

    if (!housekeepingTask || !meetingId) {
       await createLog(path, action, "All fields are required", user, ip, company);
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
       await createLog(path, action, "Invalid meeting ID provided", user, ip, company);
      return res.status(400).json({ message: "Invalid meeting ID provided" });
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $pull: { housekeepingChecklist: { name: housekeepingTask } } },
      { new: true }
    );

    if (!updatedMeeting) {
       await createLog(path, action, "Failed to delete housekeeping task", user, ip, company);
      return res.status(400).json({ message: "Failed to delete housekeeping task" });
    }

    const meetingLog = new MeetingLog({
      meetingId: meetingId,
      action: "Housekeeping Task Deleted",
      performedBy: req.userData.userId,
      changes: { deletedTask: housekeepingTask },
      remarks: "Housekeeping task removed from meeting",
      ipAddress: ipAddress,
    });

    await meetingLog.save();

    return res.status(200).json({
      message: "Housekeeping task deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};


// const updateHousekeepingTasks = async (req, res, next) => {

//   try {

//     const {meetingId,housekeepingTasks} = req.body

//     if(!meetingId || !housekeepingTasks){
//       return res.status(400).json({message:"All feilds are required"})
//     }

//     if(!mongoose.Types.ObjectId.isValid(meetingId)){
//       return res.status(400).json({message:"Invalid meeting id provided"})
//     }

//     const updatedHousekeepingCheckLlist = await Meeting.updateOne(
//       { _id: meetingId },
//       {
//         $set: {
//           "housekeepingChecklist.$[task].status": "Completed",
//         },
//       },
//       {
//         arrayFilters: [
//           { "task.name": { $in: housekeepingTasks.map((task) => task.name) } },
//         ],
//         new: true,
//       }
//     );

//     if(!updatedHousekeepingCheckLlist){
//       return res.status(400).json({message:"Failed to add the housekeeping tasks"})
//     }

//     return res.status(200).json({message: "Housekeeping tasks added successfully"})

//   } catch (error) {
//     next(error)
//   }
// }
 

const getMeetingsByTypes = async (req, res, next) => {

  try {

    const {type} = req.query
    const company = req.company

    if(!type){
      return res.status(400).json({message:"Please send the meeting type"})
    }
 

    const meetings = await Meeting.find({meetingType:type}).populate([
      {
        path: "company",
        select: "companyName", 
      },
      {
        path: "bookedRoom",
        select: "name location",  
      },
    ]);

    if(!meetings){
      return res.status(400).json({message:`Failed to fetch ${type} meetings`})
    }

    const transformedMeetings = meetings.map((meeting) => {
      
      return {
        _id: meeting._id,
        roomName: meeting.bookedRoom.name,
        location: meeting.bookedRoom.location.name,
        meetingType:meeting.meetingType,
        endTime: formatTime(meeting.endTime),
        company: meeting.company.companyName,
      };
    });

    return res.status(200).json(transformedMeetings)

  } catch (error) {
    next(error)
  }
}


module.exports = { addMeetings, getMeetings, addHousekeepingTask,deleteHousekeepingTask,getMeetingsByTypes };
