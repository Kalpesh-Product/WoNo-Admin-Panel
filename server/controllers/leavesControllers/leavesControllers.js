const Leave = require("../../models/hr/Leaves");
const mongoose = require("mongoose");
const UserData = require("../../models/hr/UserData");
const { createLog } = require("../../utils/moduleLogs");
<<<<<<< HEAD
const csvParser = require("csv-parser");
const { Readable } = require("stream");
const Company = require("../../models/Company");
=======
const CustomError = require("../../utils/customErrorlogs");
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc

const requestLeave = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Request Leave";
  const logSourceKey = "leave";
  const { user, ip, company } = req;

  try {
    const { fromDate, toDate, leaveType, leavePeriod, hours, description } =
      req.body;

    if (
      !fromDate ||
      !toDate ||
      !leaveType ||
      !leavePeriod ||
      !hours ||
      !description
    ) {
<<<<<<< HEAD
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
=======
      throw new CustomError(
        "All fields are required",
        logPath,
        logAction,
        logSourceKey
      );
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const currDate = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
<<<<<<< HEAD
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
=======
      throw new CustomError(
        "Invalid date format",
        logPath,
        logAction,
        logSourceKey
      );
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
    }

    // Ensure the leave starts in the future
    if (startDate < currDate) {
<<<<<<< HEAD
      await createLog(
        path,
        action,
        "Please select future date",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Please select future date" });
=======
      throw new CustomError(
        "Please select future date",
        logPath,
        logAction,
        logSourceKey
      );
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
    }

    const foundUser = await UserData.findById({ _id: user }).populate({
      path: "company",
      select: "employeeTypes",
    });

    if (!foundUser) {
      throw new CustomError("User not found", logPath, logAction, logSourceKey);
    }

    // Check if the user has already taken leaves that exceed the granted limit
    const leaves = await Leave.find({ takenBy: user });
    if (leaves) {
      const singleLeaves = leaves.filter(
        (leave) =>
          (leave.leavePeriod === "Single" && leave.leaveType === leaveType) ||
          leave.leaveType === "Abrupt"
      );
      const singleLeaveHours = singleLeaves.length * 9;

      const partialLeaveHours = leaves
        .filter((leave) => leave.leavePeriod === "Partial")
        .reduce((acc, leave) => acc + leave.hours, 0);

<<<<<<< HEAD
      const grantedLeaves = foundUser.employeeType.leavesCount.find((leave) => {
        return leave.leaveType.toLowerCase() === leaveType.toLowerCase();
      });
=======
      const grantedLeaves = foundUser.employeeType.leavesCount.find(
        (leave) => leave.leaveType.toLowerCase() === leaveType.toLowerCase()
      );
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc

      const grantedLeaveHours = grantedLeaves ? grantedLeaves.count * 9 : 0;
      const takenLeaveHours = singleLeaveHours + partialLeaveHours;

      if (takenLeaveHours > grantedLeaveHours) {
<<<<<<< HEAD
        await createLog(
          path,
          action,
          "Can't request more leaves",
          "Failed",
          user,
          ip,
          company
        );
        return res.status(400).json({ message: "Can't request more leaves" });
      }
    }

=======
        throw new CustomError(
          "Can't request more leaves",
          logPath,
          logAction,
          logSourceKey
        );
      }
    }

    // Calculate number of days (this might be used to adjust leave type)
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
    const noOfDays = Math.abs(
      (currDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    let updatedLeaveType = "";
    if (leaveType === "Privileged" && noOfDays < 7) {
      updatedLeaveType = "Abrupt";
    }

    const newLeave = new Leave({
      company,
      takenBy: user,
      leaveType: updatedLeaveType ? updatedLeaveType : leaveType,
      fromDate,
      toDate,
      leavePeriod,
      hours,
      description,
    });

    await newLeave.save();

<<<<<<< HEAD
    // Success log with details of the leave request
    await createLog(
      path,
      action,
      "Leave request sent successfully",
      "Success",
      user,
      ip,
      company,
      newLeave._id,
      {
        fromDate,
        toDate,
        leaveType: updatedLeaveType ? updatedLeaveType : leaveType,
        leavePeriod,
        hours,
        description,
      }
    );
=======
    // Success log for leave request creation
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Leave request sent successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: newLeave._id,
      changes: {
        fromDate,
        toDate,
        leaveType: newLeave.leaveType,
        leavePeriod,
        hours,
        description,
      },
    });
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc

    return res.status(201).json({ message: "Leave request sent" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const fetchAllLeaves = async (req, res, next) => {
  try {
    const user = req.userData.userId;

    const leaves = await Leave.find({ takenBy: user });

    if (!leaves || leaves.length === 0) {
      return res.status(204).json({ message: "No leaves found" });
    }

    return res.status(200).json(leaves);
  } catch (error) {
    next(error);
  }
};

const fetchLeavesBeforeToday = async (req, res, next) => {
  try {
    const user = req.userData.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leavesBeforeToday = await Leave.find({
      fromDate: { $lt: today },
      takenBy: user,
    });

    if (!leavesBeforeToday) {
      return res.status(204).json({ message: "No leaves found" });
    }

    return res.status(200).json(leavesBeforeToday);
  } catch (error) {
    next(error);
  }
};

const approveLeave = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Approve Leave Request";
  const logSourceKey = "leave";
  const { user, ip, company } = req;

  try {
    const leaveId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
<<<<<<< HEAD
      await createLog(
        path,
        action,
        "Invalid Leave Id provided",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid Leave Id provided" });
=======
      throw new CustomError(
        "Invalid Leave Id provided",
        logPath,
        logAction,
        logSourceKey
      );
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId },
      {
        $set: { status: "Approved", approvedBy: user },
        $unset: { rejectedBy: "" },
      },
      { new: true }
    );

    if (!updatedLeave) {
<<<<<<< HEAD
      await createLog(
        path,
        action,
        "Couldn't approve the leave request",
        "Failed",
        user,
        ip,
        company
      );
      return res
        .status(400)
        .json({ message: "Couldn't approve the leave request" });
    }

    // Success log
    await createLog(
      path,
      action,
      "Leave approved successfully",
      "Success",
      user,
      ip,
      company,
      updatedLeave._id,
      {
        status: "Approved",
        approvedBy: user,
      }
    );
=======
      throw new CustomError(
        "Couldn't approve the leave request",
        logPath,
        logAction,
        logSourceKey
      );
    }

    // Log the successful approval
    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Leave approved successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedLeave._id,
      changes: {
        status: "Approved",
        approvedBy: user,
      },
    });
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc

    return res.status(200).json({ message: "Leave Approved" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

const rejectLeave = async (req, res, next) => {
  const logPath = "hr/HrLog";
  const logAction = "Reject Leave Request";
  const logSourceKey = "leave";
  const { user, ip, company } = req;

  try {
    const leaveId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
<<<<<<< HEAD
      await createLog(
        path,
        action,
        "Invalid Leave Id provided",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "Invalid Leave Id provided" });
=======
      throw new CustomError(
        "Invalid Leave Id provided",
        logPath,
        logAction,
        logSourceKey
      );
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId },
      {
        $set: { status: "Rejected", rejectedBy: user },
        $unset: { approvedBy: "" },
      },
      { new: true }
    );

    if (!updatedLeave) {
<<<<<<< HEAD
      await createLog(
        path,
        action,
        "No such leave exists",
        "Failed",
        user,
        ip,
        company
      );
      return res.status(400).json({ message: "No such leave exists" });
    }

    await createLog(
      path,
      action,
      "Leave rejected successfully",
      "Success",
      user,
      ip,
      company,
      updatedLeave._id,
      {
        status: "Rejected",
        rejectedBy: user,
      }
    );
=======
      throw new CustomError(
        "No such leave exists",
        logPath,
        logAction,
        logSourceKey
      );
    }

    await createLog({
      path: logPath,
      action: logAction,
      remarks: "Leave rejected successfully",
      status: "Success",
      user: user,
      ip: ip,
      company: company,
      sourceKey: logSourceKey,
      sourceId: updatedLeave._id,
      changes: { status: "Rejected", rejectedBy: user },
    });
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc

    return res.status(200).json({ message: "Leave rejected" });
  } catch (error) {
    next(new CustomError(error.message, 500, logPath, logAction, logSourceKey));
  }
};

<<<<<<< HEAD
const bulkInsertLeaves = async (req, res, next) => {
  try {
    const file = req.file;
    if (!file) {
      return res
        .status(400)
        .json({ message: "Please provide a valid csv file" });
    }

    const { company } = req;
    const foundCompany = Company.findOne({ _id: company }).lean().exec();
    if (!foundCompany) {
      return res.status(400).json({ message: "No such company is registered" });
    }
  } catch (error) {
    next(error);
  }
};

=======
>>>>>>> 12b5bbbd05bb7184a95f229f9faa1c31684657fc
module.exports = {
  requestLeave,
  fetchAllLeaves,
  fetchLeavesBeforeToday,
  approveLeave,
  rejectLeave,
};
