const Attendance = require("../models/hr/Attendance");
const mongoose = require("mongoose");
const { formatDate, formatTime } = require("../utils/formatDateTime");
const { createLog } = require("../utils/moduleLogs");
const CustomError = require("../utils/customErrorlogs");

const clockIn = async (req, res, next) => {
  const { user, ip, company } = req;
  const { inTime, entryType } = req.body;
  const logPath = "hr/HrLog";
  const logAction = "Clock In";
  const logSourceKey = "attendance";

  try {
    if (!inTime || !entryType) {
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const clockInTime = new Date(inTime);
    const currDate = new Date();

    if (clockInTime.getDate() !== currDate.getDate()) {
      throw new CustomError(
        "Please select present date",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (isNaN(clockInTime.getTime())) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Check if the user has already clocked in today
    const attendances = await Attendance.find({ user: user._id });
    const todayClockInExists = attendances.some((attendance) => {
      const attendanceTime = new Date(attendance.inTime);
      return attendanceTime.getDate() === clockInTime.getDate();
    });

    if (todayClockInExists) {
      throw new CustomError(
        "Cannot clock in for the day again",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const newAttendance = new Attendance({
      inTime: clockInTime,
      entryType,
      user: user._id,
      company,
    });

    await newAttendance.save();

    // Log the successful clock-in
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Clock in successful",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: newAttendance._id,
      changes: {
        inTime: clockInTime,
        entryType,
      },
    });

    return res.status(201).json({ message: "You clocked in" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const clockOut = async (req, res, next) => {
  const { user, ip, company } = req;
  const { outTime } = req.body;
  const logPath = "hr/HrLog";
  const logAction = "Clock Out";
  const logSourceKey = "attendance";

  try {
    if (!outTime) {
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const clockOutTime = new Date(outTime);
    if (isNaN(clockOutTime.getTime())) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Retrieve the latest attendance record for the user
    const attendance = await Attendance.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    if (!attendance) {
      throw new CustomError(
        "No attendance record exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (attendance.outTime) {
      throw new CustomError(
        "Already clocked out",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Update the attendance record with outTime
    attendance.outTime = clockOutTime;
    await attendance.save();

    // Log the successful clock out
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Clock out successful",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: attendance._id,
      changes: {
        inTime: attendance.inTime,
        outTime: clockOutTime,
      },
    });

    return res.status(200).json({ message: "You clocked out" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const startBreak = async (req, res, next) => {
  const logPath = "AttendanceLogs";
  const logAction = "Start Break";
  const logSourceKey = "attendance";
  const { startBreak } = req.body;
  const loggedInUser = req.user;
  const ip = req.ip;
  const company = req.company;

  try {
    if (!startBreak) {
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const startBreakTime = new Date(startBreak);
    if (isNaN(startBreakTime.getTime())) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Retrieve the latest attendance record for the user
    const attendance = await Attendance.findOne({
      user: loggedInUser._id,
    }).sort({ createdAt: -1 });
    if (!attendance) {
      throw new CustomError(
        "No clock in record exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (attendance.breakCount === 2) {
      throw new CustomError(
        "Only 2 breaks allowed",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      attendance._id,
      {
        startBreak: startBreakTime,
        endBreak: null,
        breakCount: attendance.breakCount + 1,
      },
      { new: true }
    );

    if (!updatedAttendance) {
      throw new CustomError(
        "No clock in record exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful break start
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Break started successfully",
      status: "Success",
      user: loggedInUser,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedAttendance._id,
      changes: {
        startBreak: startBreakTime,
        breakCount: updatedAttendance.breakCount,
      },
    });

    return res.status(200).json({ message: "Break started" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const endBreak = async (req, res, next) => {
  const { user, ip, company } = req;
  const { endBreak } = req.body;
  const logPath = "hr/HrLog";
  const logAction = "End Break";
  const logSourceKey = "attendance";

  try {
    if (!endBreak) {
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const endBreakTime = new Date(endBreak);
    if (isNaN(endBreakTime.getTime())) {
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Retrieve the latest attendance record for the user
    const attendance = await Attendance.findOne({ user: user._id }).sort({
      createdAt: -1,
    });
    if (!attendance) {
      throw new CustomError(
        "No clock in record exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    if (!attendance.startBreak) {
      throw new CustomError(
        "No break record found",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const startBreakTime = new Date(attendance.startBreak);
    const breakDuration =
      (endBreakTime - startBreakTime) / (1000 * 60) +
      (attendance.breakDuration || 0);

    attendance.endBreak = endBreakTime;
    attendance.breakDuration = breakDuration;
    await attendance.save();

    // Log the successful break end
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Break ended successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: attendance._id,
      changes: {
        startBreak: attendance.startBreak,
        endBreak: endBreakTime,
        breakDuration,
      },
    });

    return res.status(200).json({ message: "Break ended" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const getAllAttendance = async (req, res, next) => {
  const company = req.userData.company;

  try {
    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json("Invalid company Id provided");
    }

    let attendances = [];
    attendances = await Attendance.find({ company });

    if (!attendances) {
      return res.status(400).json({ message: "No attendance exists" });
    }

    const transformedAttendances = attendances.map((attendance) => {
      const totalMins =
        attendance.outTime && attendance.inTime
          ? (attendance.outTime - attendance.inTime) / (1000 * 60)
          : 0;

      const breakMins = attendance.breakDuration || 0;
      const workMins = totalMins > breakMins ? totalMins - breakMins : 0;

      return {
        date: formatDate(attendance.inTime) || "N/A",
        inTime: formatTime(attendance.inTime) || "N/A",
        outTime: formatTime(attendance.outTime) || "N/A",
        workHours: (workMins / 60).toFixed(2),
        breakHours: (breakMins / 60).toFixed(2),
        totalHours: (totalMins / 60).toFixed(2),
        entryType: attendance.entryType || "N/A",
      };
    });

    return res.status(200).json(transformedAttendances);
  } catch (error) {
    next(error);
  }
};

const getAttendance = async (req, res, next) => {
  const { id } = req.params;

  try {
    const attendances = await Attendance.aggregate([
      {
        $lookup: {
          from: "userdatas",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $match: { "userDetails.empId": id },
      },
    ]);

    if (!attendances) {
      return res.status(400).json({ message: "No attendance exists" });
    }

    const transformedAttendances = attendances.map((attendance) => {
      const totalMins =
        attendance.outTime && attendance.inTime
          ? (attendance.outTime - attendance.inTime) / (1000 * 60)
          : 0;

      const breakMins = attendance.breakDuration || 0;
      const workMins = totalMins > breakMins ? totalMins - breakMins : 0;

      return {
        date: formatDate(attendance.inTime) || "N/A",
        inTime: formatTime(attendance.inTime) || "N/A",
        outTime: formatTime(attendance.outTime) || "N/A",
        workHours: (workMins / 60).toFixed(2),
        breakHours: (breakMins / 60).toFixed(2),
        totalHours: (totalMins / 60).toFixed(2),
        entryType: attendance.entryType || "N/A",
      };
    });

    return res.status(200).json(transformedAttendances);
  } catch (error) {
    next(error);
  }
};

const correctAttendance = async (req, res, next) => {
  const { user, ip, company } = req;
  const { targetedDay, inTime, outTime } = req.body;
  const logPath = "hr/HrLog";
  const logAction = "Correct Attendance";
  const logSourceKey = "attendance";

  const clockIn = inTime ? new Date(inTime) : null;
  const clockOut = outTime ? new Date(outTime) : null;

  try {
    if (!targetedDay) {
      throw new CustomError(
        "Correction Day is required",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const targetedDate = new Date(targetedDay);
    const targetDateOnly = new Date(
      targetedDate.getUTCFullYear(),
      targetedDate.getUTCMonth(),
      targetedDate.getUTCDate()
    );

    if (isNaN(targetedDate.getTime())) {
      throw new CustomError(
        "Invalid Date format",
        logPath,
        logAction,
        logSourceKey
      );
    }
    if (inTime && isNaN(clockIn.getTime())) {
      throw new CustomError(
        "Invalid inTime format",
        logPath,
        logAction,
        logSourceKey
      );
    }
    if (outTime && isNaN(clockOut.getTime())) {
      throw new CustomError(
        "Invalid outTime format",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const foundDate = await Attendance.findOne({
      createdAt: {
        $gte: targetDateOnly,
        $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!foundDate) {
      throw new CustomError(
        "No timeclock found for the date",
        logPath,
        logAction,
        logSourceKey
      );
    }

    const updateTimeClock = {
      inTime: clockIn ? clockIn : foundDate.inTime,
      outTime: clockOut ? clockOut : foundDate.outTime,
    };

    await Attendance.findOneAndUpdate(
      {
        createdAt: {
          $gte: targetDateOnly,
          $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      { $set: updateTimeClock }
    );

    // Log the successful attendance correction
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Attendance corrected successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: foundDate._id,
      changes: {
        oldInTime: foundDate.inTime,
        oldOutTime: foundDate.outTime,
        newInTime: updateTimeClock.inTime,
        newOutTime: updateTimeClock.outTime,
      },
    });

    return res.status(200).json({ message: "Attendance corrected" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

module.exports = {
  clockIn,
  clockOut,
  startBreak,
  endBreak,
  getAllAttendance,
  getAttendance,
  correctAttendance,
};
