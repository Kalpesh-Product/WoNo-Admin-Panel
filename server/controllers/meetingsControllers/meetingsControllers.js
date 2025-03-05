const Meeting = require("../../models/meetings/Meetings");
const ExternalClient = require("../../models/meetings/ExternalClients");
const User = require("../../models/hr/UserData");
const { default: mongoose } = require("mongoose");
const Room = require("../../models/meetings/Rooms");
const {
  formatDate,
  formatTime,
  formatDuration,
} = require("../../utils/formatDateTime");
const Department = require("../../models/Departments");
const { createLog } = require("../../utils/moduleLogs");
const CustomError = require("../../utils/customErrorlogs");

const addMeetings = async (req, res, next) => {
  const logPath = "meetings/MeetingLog";
  const logAction = "Book Meeting";
  const logSourceKey = "meeting";

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

    if (
      !meetingType ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !subject ||
      !agenda
    ) {
      throw new CustomError(
        "Missing required fields",
        400,
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(bookedRoom)) {
      throw new CustomError(
        "Invalid Room Id provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);

    if (
      isNaN(startDateObj.getTime()) ||
      isNaN(endDateObj.getTime()) ||
      isNaN(startTimeObj.getTime()) ||
      isNaN(endTimeObj.getTime())
    ) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const roomAvailable = await Room.findById({
      _id: bookedRoom,
      "location.status": "Available",
    });

    if (!roomAvailable) {
      throw new CustomError(
        "Room is unavailable",
        logPath,
        logAction,
        logSourceKey
      );
    }

    let participants = [];

    if (internalParticipants) {
      const invalidIds = internalParticipants.filter(
        (id) => !mongoose.Types.ObjectId.isValid(id)
      );

      if (invalidIds.length > 0) {
        throw new CustomError(
          "Invalid internal participant IDs",
          logPath,
          logAction,
          logSourceKey
        );
      }

      const users = await User.find({ _id: { $in: internalParticipants } });

      const unmatchedIds = internalParticipants.filter(
        (id) => !users.find((user) => user._id.toString() === id)
      );

      if (unmatchedIds.length > 0) {
        throw new CustomError(
          "Some internal participant IDs did not match any user",
          logPath,
          logAction,
          logSourceKey
        );
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
        throw new CustomError(
          "Missing required fields for external participants",
          logPath,
          logAction,
          logSourceKey
        );
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
      $or: [
        { startDate: { $lte: endDateObj }, endDate: { $gte: startDateObj } },
      ],
      $and: [
        { startTime: { $lte: endTimeObj } },
        { endTime: { $gte: startTimeObj } },
      ],
    });

    if (conflictingMeeting) {
      throw new CustomError(
        "Room is already booked for the specified time",
        logPath,
        logAction,
        logSourceKey
      );
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
    };

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Meeting added successfully and updated room status",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: meeting._id,
      changes: data,
    });

    return res.status(201).json({
      message: "Meeting added successfully",
    });
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
    } else {
      next(
        new CustomError(error.message, 500, logPath, logAction, logSourceKey)
      );
    }
  }
};

const getMeetings = async (req, res, next) => {
  try {
    const { user, company } = req;

    const meetings = await Meeting.find({
      company,
    })
      .populate("bookedRoom", "name location housekeepingStatus")
      .populate("bookedBy", "firstName lastName email")
      .populate("internalParticipants", "firstName lastName email");

    const departments = await User.findById({ _id: user }).select(
      "departments"
    );

    const department = await Department.findById({
      _id: departments.departments[0],
    });

    const internalParticipants = meetings.map((meeting) => {
      if (meeting.internalParticipants.length === 0) {
        return;
      }

      return meetings.map((meeting) =>
        meeting.internalParticipants.map((participant) => participant?.name)
      );
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

    const transformedMeetings = meetings.map((meeting, index) => {
      return {
        _id: meeting._id,
        name: meeting.bookedBy?.name,
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
        housekeepingChecklist: [...(meeting.housekeepingChecklist ?? [])],
        // internalParticipants: internalParticipants[index],
        // externalParticipants: meeting.externalParticipants,
        participants:
          meeting.externalParticipants.length > 0
            ? meeting.externalParticipants
            : internalParticipants[index],
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
    const { housekeepingTasks, meetingId, roomName } = req.body;
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    const logPath = "meetings/MeetingLog";
    const logAction = "Add Housekeeping Tasks";
    const logSourceKey = "meeting";

    if (!housekeepingTasks || !meetingId || !roomName) {
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      throw new CustomError(
        "Invalid meeting id provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const inCompleteTasks = housekeepingTasks.filter(
      (task) => task.status === "Pending"
    );

    if (inCompleteTasks.length > 0) {
      throw new CustomError(
        "Please check out the tasks before submitting",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const completedTasks = housekeepingTasks.map((task) => ({
      name: task.name,
    }));

    const foundMeeting = await Meeting.findByIdAndUpdate(
      { _id: meetingId },
      { $push: { housekeepingChecklist: completedTasks } },
      { new: true }
    );

    const room = await Room.findOneAndUpdate(
      { name: roomName },
      { housekeepingStatus: "Completed", "location.status": "Available" },
      { new: true }
    );

    if (!foundMeeting) {
      throw new CustomError(
        "Failed to add the housekeeping tasks",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!room) {
      throw new CustomError(
        "Failed to update the room status",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Housekeeping tasks completed and room status updated",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: foundMeeting._id,
      changes: { housekeepingTasks: completedTasks, roomName },
    });

    return res
      .status(200)
      .json({ message: "Housekeeping tasks added successfully" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const deleteHousekeepingTask = async (req, res, next) => {
  const company = req.company;
  const user = req.user;
  const ip = req.ip;
  const logPath = "meetings/MeetingLog";
  const logAction = "Delete Housekeeping Tasks";
  const logSourceKey = "meeting";

  try {
    const { housekeepingTask, meetingId } = req.body;

    if (!housekeepingTask || !meetingId) {
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      throw new CustomError(
        "Invalid meeting ID provided",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      meetingId,
      { $pull: { housekeepingChecklist: { name: housekeepingTask } } },
      { new: true }
    );

    if (!updatedMeeting) {
      throw new CustomError(
        "Failed to delete housekeeping task",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Housekeeping task deleted successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: meetingId,
      changes: { deletedTask: housekeepingTask },
    });

    return res.status(200).json({
      message: "Housekeeping task deleted successfully",
    });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const getMeetingsByTypes = async (req, res, next) => {
  try {
    const { type } = req.query;
    const company = req.company;

    if (!type) {
      throw new CustomError(
        "Please send the meeting type",
        400,
        "meetings/MeetingLog",
        "Delete Meeting",
        "meeting"
      );
    }

    const meetings = await Meeting.find({ meetingType: type }).populate([
      {
        path: "company",
        select: "companyName",
      },
      {
        path: "bookedRoom",
        select: "name location",
      },
    ]);

    if (!meetings) {
      return res
        .status(400)
        .json({ message: `Failed to fetch ${type} meetings` });
    }

    const transformedMeetings = meetings.map((meeting) => {
      return {
        _id: meeting._id,
        roomName: meeting.bookedRoom.name,
        location: meeting.bookedRoom.location.name,
        meetingType: meeting.meetingType,
        endTime: formatTime(meeting.endTime),
        company: meeting.company.companyName,
      };
    });

    return res.status(200).json(transformedMeetings);
  } catch (error) {
    next(error);
  }
};

const cancelMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let path = "meetings/MeetingLog";
    let action = "Cancel Meeting";

    if (!meetingId) {
      throw new CustomError(
        "Meeting ID is required",
        400,
        "meetings/MeetingLog",
        "Cancel Meeting",
        "meeting"
      );
    }

    const cancelledMeeting = await Meeting.findByIdAndUpdate(
      { _id: meetingId },
      { status: "Cancelled" },
      { new: true }
    );

    if (!cancelledMeeting) {
      throw new CustomError(
        "Meeting not found, please check the ID",
        400,
        "meetings/MeetingLog",
        "Cancel Meeting",
        "meeting"
      );
    }

    await createLog(
      path,
      action,
      "Meeting cancelled successfully",
      "Success",
      user,
      ip,
      company,
      cancelledMeeting._id,
      {
        meetingId,
      }
    );

    res.status(200).json({ message: "Meeting cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

const extendMeeting = async (req, res, next) => {
  try {
    const { meetingId } = req.params;
    const { newEndTime } = req.body;
    const company = req.company;
    const user = req.user;
    const ip = req.ip;
    let path = "meetings/MeetingLog";
    let action = "Extend Meeting";

    if (!meetingId || !newEndTime) {
      await createLog(
        path,
        action,
        "Meeting ID and new end time are required",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "Meeting ID and new end time are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      await createLog(
        path,
        action,
        "Invalid meeting ID",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid meeting ID" });
    }

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      await createLog(
        path,
        action,
        "Meeting not found",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(404).json({ message: "Meeting not found" });
    }

    const newEndTimeObj = new Date(newEndTime);
    if (isNaN(newEndTimeObj.getTime())) {
      await createLog(
        path,
        action,
        "Invalid new end time format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid new end time format" });
    }

    if (newEndTimeObj <= meeting.endTime) {
      await createLog(
        path,
        action,
        "New end time must be later than the current end time",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({
        message: "New end time must be later than the current end time",
      });
    }

    const conflictingMeeting = await Meeting.findOne({
      bookedRoom: meeting.bookedRoom,
      startDate: meeting.startDate,
      startTime: { $lt: newEndTimeObj },
      endTime: { $gt: meeting.endTime },
      _id: { $ne: meetingId },
    });

    if (conflictingMeeting) {
      await createLog(
        path,
        action,
        "Room is already booked during the extended time",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "Room is already booked during the extended time" });
    }

    meeting.endTime = newEndTimeObj;
    await meeting.save();

    await createLog(
      path,
      action,
      "Meeting extended successfully",
      "Success",
      user,
      ip,
      company,
      meeting._id,
      {
        meetingId,
        oldEndTime: meeting.endTime,
        newEndTime: newEndTimeObj,
      }
    );

    res
      .status(200)
      .json({ message: "Meeting extended successfully", newEndTime });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMeetings,
  getMeetings,
  addHousekeepingTask,
  deleteHousekeepingTask,
  getMeetingsByTypes,
  cancelMeeting,
};
