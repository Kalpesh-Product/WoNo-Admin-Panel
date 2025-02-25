const Attendance = require("../models/Attendance");
const UserData = require("../models/UserData");
const mongoose = require("mongoose");
const { formatDate, formatTime } = require("../utils/formatDateTime");
const csvParser = require("csv-parser");
const { Readable } = require("stream");

const clockIn = async (req, res, next) => {
  const { user, ip, company } = req;

  const { inTime, entryType } = req.body;
  const path = "AttendanceLogs";
  const action = "Clock In";

  try {
    if (!inTime || !entryType) {
      await createLog(
        path,
        action,
        "All fields are required",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "All fields are required" });
    }

    const clockIn = new Date(inTime);
    const currDate = new Date();

    if (clockIn.getDate() !== currDate.getDate()) {
      await createLog(
        path,
        action,
        "Please select present date",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Please select present date" });
    }

    if (isNaN(clockIn.getTime())) {
      await createLog(
        path,
        action,
        "Invalid date format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Check if the user has already clocked in today
    const attendances = await Attendance.find({ user: user._id });
    const todayClockInExists = attendances.some((attendance) => {
      const inTime = new Date(attendance.inTime);
      return inTime.getDate() === clockIn.getDate();
    });

    if (todayClockInExists) {
      await createLog(
        path,
        action,
        "Cannot clock in for the day again",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "Cannot clock in for the day again" });
    }

    const newAttendance = new Attendance({
      inTime: clockIn,
      entryType,
      user: user._id,
      company,
    });

    await newAttendance.save();

    // Success log for clocking in
    await createLog(
      path,
      action,
      "Clock in successful",
      "Success",
      user,
      ip,
      company,
      newAttendance._id,
      {
        inTime: clockIn,
        entryType,
      }
    );

    return res.status(201).json({ message: "You clocked in" });
  } catch (error) {
    next(error);
  }
};

const clockOut = async (req, res, next) => {
  const { user, ip, company } = req;
  const { outTime } = req.body;
  const path = "AttendanceLogs";
  const action = "Clock Out";

  try {
    if (!outTime) {
      await createLog(
        path,
        action,
        "All fields are required",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "All fields are required" });
    }

    const clockOut = new Date(outTime);
    if (isNaN(clockOut.getTime())) {
      await createLog(
        path,
        action,
        "Invalid date format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid date format" });
    }

    const attendance = await Attendance.findOne({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!attendance) {
      await createLog(
        path,
        action,
        "No attendance record exists",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "No attendance record exists" });
    }

    if (attendance.outTime) {
      await createLog(
        path,
        action,
        "Already clocked out",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Already clocked out" });
    }

    // Update the attendance record with outTime
    attendance.outTime = clockOut;
    await attendance.save();

    // Success log for clocking out
    await createLog(
      path,
      action,
      "Clock out successful",
      "Success",
      user,
      ip,
      company,
      attendance._id,
      {
        inTime: attendance.inTime,
        outTime: clockOut,
      }
    );

    return res.status(200).json({ message: "You clocked out" });
  } catch (error) {
    next(error);
  }
};

const startBreak = async (req, res, next) => {
  const { startBreak } = req.body;
  const loggedInUser = req.user;

  try {
    if (!startBreak) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startBreakTime = new Date(startBreak);
    if (isNaN(startBreakTime.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const attendance = await Attendance.findOne({ user: loggedInUser })
      .sort({ createdAt: -1 })
      .limit(1);

    if (attendance.breakCount === 2) {
      return res.status(400).json({ message: "Only 2 breaks allowed" });
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      { _id: attendance._id },
      {
        startBreak: startBreakTime,
        endBreak: null,
        breakCount: attendance.breakCount + 1,
      },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(400).json({ message: "No clock in record exists" });
    }

    return res.status(200).json({ message: "Break started" });
  } catch (error) {
    next(error);
  }
};

const endBreak = async (req, res, next) => {
  const { user, ip, company } = req;
  const { endBreak } = req.body;
  const path = "AttendanceLogs";
  const action = "End Break";

  try {
    if (!endBreak) {
      await createLog(
        path,
        action,
        "All fields are required",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "All fields are required" });
    }

    const endBreakTime = new Date(endBreak);
    if (isNaN(endBreakTime.getTime())) {
      await createLog(
        path,
        action,
        "Invalid date format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid date format" });
    }

    const attendance = await Attendance.findOne({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!attendance) {
      await createLog(
        path,
        action,
        "No clock in record exists",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "No clock in record exists" });
    }

    if (!attendance.startBreak) {
      await createLog(
        path,
        action,
        "No break record found",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "No break record found" });
    }

    const startBreakTime = new Date(attendance.startBreak);
    const breakDuration =
      (endBreakTime - startBreakTime) / (1000 * 60) + attendance.breakDuration;

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      { _id: attendance._id },
      { endBreak: endBreakTime, breakDuration },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(400).json({ message: "No clock in record exists" });
    }

    return res.status(200).json({ message: "Break ended" });
  } catch (error) {
    next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  const company = req.userData.company;


  try {
    // const user = await UserData.findById({ _id: loggedInUser }).populate({
    //   path: "role",
    //   select: "roleTitle",
    // });

    // const validRoles = ["Master Admin", "Super Admin", "HR Admin"];

    // const hasPermission = user.role.some((role) =>
    //   validRoles.includes(role.roleTitle)
    // );

    // if (!hasPermission) {
    //   return res.sendStatus(403);
    // }

    if (!mongoose.Types.ObjectId.isValid(company)) {
      return res.status(400).json("Invalid company Id provided");
    }

    let attendances = [];
    attendances = await Attendance.find({ company });
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
        date: formatDate(attendance.inTime) || "N/A",
        inTime: formatTime(attendance.inTime) || "N/A",
        outTime: formatTime(attendance.outTime) || "N/A",
        workHours: (workMins / 60).toFixed(2),
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
    const attendances = await Attendance.find({
      user: loggedInUser,
      company,
    });

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
  const path = "AttendanceLogs";
  const action = "Correct Attendance";

  const clockIn = inTime ? new Date(inTime) : null;
  const clockOut = outTime ? new Date(outTime) : null;

  try {
    if (!targetedDay) {
      await createLog(
        path,
        action,
        "Correction Day is required",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Correction Day is required" });
    }

    const targetedDate = new Date(targetedDay);
    const targetDateOnly = new Date(
      targetedDate.getUTCFullYear(),
      targetedDate.getUTCMonth(),
      targetedDate.getUTCDate()
    );

    if (isNaN(targetedDate.getTime())) {
      await createLog(
        path,
        action,
        "Invalid Date format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid Date format" });
    }
    if (inTime && isNaN(clockIn.getTime())) {
      await createLog(
        path,
        action,
        "Invalid inTime format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid inTime format" });
    }
    if (outTime && isNaN(clockOut.getTime())) {
      await createLog(
        path,
        action,
        "Invalid outTime format",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid outTime format" });
    }

    const foundDate = await Attendance.findOne({
      createdAt: {
        $gte: targetDateOnly,
        $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (!foundDate) {
      await createLog(
        path,
        action,
        "No timeclock found for the date",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "No timeclock found for the date" });
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

    // Success log for attendance correction
    await createLog(
      path,
      action,
      "Attendance corrected successfully",
      "Success",
      user,
      ip,
      company,
      foundDate._id,
      {
        oldInTime: foundDate.inTime,
        oldOutTime: foundDate.outTime,
        newInTime: updateTimeClock.inTime,
        newOutTime: updateTimeClock.outTime,
      }
    );

    return res.status(200).json({ message: "Attendance corrected" });
  } catch (error) {
    next(error);
  }
};

const bulkInsertAttendance = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const companyId = req.company;

    const employees = await UserData.find({ company: companyId })
      .select("_id empId")
      .lean();

    const employeeMap = new Map(employees.map((emp) => [emp.empId, emp._id]));

    const newAttendanceRecords = [];
    const stream = Readable.from(req.file.buffer.toString("utf-8").trim());

    stream
      .pipe(csvParser())
      .on("data", async (row) => {
        try {
          const empId = row["User (Emp ID)"].trim();
          if (!employeeMap.has(empId)) {
            throw new Error(`Employee not found: ${empId}`);
          }

          const attendanceRecord = {
            company: new mongoose.Types.ObjectId(companyId),
            user: employeeMap.get(empId), 
            date: new Date(row["Date"]),
            inTime: new Date(`${row["Date"].trim()} ${row["In Time"].trim()}`),
            outTime: new Date(`${row["Date"].trim()} ${row["Out Time"].trim()}`),
            entryType: row["Entry Type"] || "web", 
          };

          newAttendanceRecords.push(attendanceRecord);
        } catch (error) {
          console.error("Error processing row:", row, error);
        }
      })
      .on("end", async () => {
        try {
          if (newAttendanceRecords.length === 0) {
            return res
              .status(400)
              .json({ message: "No valid attendance records found in CSV" });
          }

          await Attendance.insertMany(newAttendanceRecords);

          res.status(201).json({
            message: "Bulk attendance data inserted successfully",
            insertedCount: newAttendanceRecords.length,
          });
        } catch (error) {
          res
            .status(500)
            .json({ message: "Error inserting attendance records", error });
        }
      });
  } catch (error) {
    next(error);
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
  bulkInsertAttendance,
};
