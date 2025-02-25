const Leave = require("../../models/Leaves");
const mongoose = require("mongoose");
const UserData = require("../../models/UserData");
const { createLog } = require("../../utils/moduleLogs");
const csvParser = require("csv-parser");
const { Readable } = require("stream");
const Company = require("../../models/Company");

const requestLeave = async (req, res, next) => {
  const path = "LeaveLogs";
  const action = "Request Leave";
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

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const currDate = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
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

    if (startDate < currDate) {
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
    }

    const foundUser = await UserData.findById({ _id: user }).populate({
      path: "company",
      select: "employeeTypes",
    });

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

      const grantedLeaves = foundUser.employeeType.leavesCount.find((leave) => {
        return leave.leaveType.toLowerCase() === leaveType.toLowerCase();
      });

      const grantedLeaveHours = grantedLeaves.count * 9;
      const takenLeaveHours = singleLeaveHours + partialLeaveHours;

      if (takenLeaveHours > grantedLeaveHours) {
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

    return res.status(201).json({ message: "Leave request sent" });
  } catch (error) {
    next(error);
    next(error);
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
  const path = "Leavelogs";
  const action = "Approve Leave Request";
  const { user, ip, company } = req;
  try {
    const leaveId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
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
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId },
      {
        $set: { status: "Approved", approvedBy: user },
        $unset: { rejectedBy: "" },
        $set: { status: "Approved", approvedBy: user },
        $unset: { rejectedBy: "" },
      },
      { new: true }
    );

    if (!updatedLeave) {
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

    return res.status(200).json({ message: "Leave Approved" });
  } catch (error) {
    next(error);
    next(error);
  }
};

const rejectLeave = async (req, res, next) => {
  const path = "LeaveLogs";
  const action = "Reject Leave Request";
  const { user, ip, company } = req;

  try {
    const leaveId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(leaveId)) {
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

    return res.status(200).json({ message: "Leave rejected" });
  } catch (error) {
    next(error);
    next(error);
  }
};

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

module.exports = {
  requestLeave,
  fetchAllLeaves,
  fetchLeavesBeforeToday,
  approveLeave,
  rejectLeave,
};
