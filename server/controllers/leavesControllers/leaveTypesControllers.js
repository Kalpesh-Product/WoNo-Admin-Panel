const LeaveType = require("../../models/LeaveTypes");

const createLeaveType = async (req, res) => {
  try {
    // Get the sent in data off request body
    // const leaveIdFromRequestBody = req.body.leaveId;
    const leaveTypeFromRequestBody = req.body.leaveType;
    const noOfDaysFromRequestBody = req.body.noOfDays;

    // Create a leave with it (take the values from the request body / frontend and insert in the database)
    const ourCreatedLeaveType = await LeaveType.create({
      //   leaveId: leaveIdFromRequestBody,
      leaveType: leaveTypeFromRequestBody,
      noOfDays: noOfDaysFromRequestBody,

      // resolvedStatus: req.body.resolvedStatus ?? false,
    });

    // respond with the new leave (this will be our response in postman / developer tools)
    res.json({ leaveType: ourCreatedLeaveType });
  } catch (error) {
    console.log(error);
  }
};

// GET - Fetch all leave types
const fetchAllLeaveTypes = async (req, res) => {
  try {
    // Find the leaves
    const listOfAllLeaveTypes = await LeaveType.find();
    // Respond with them
    res.json({ leavesTypes: listOfAllLeaveTypes });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// DELETE - delete leave type

const deleteLeaveType = async (req, res) => {
  try {
    // get id off the url
    const leaveTypeIdFromTheUrl = req.params.id;

    // Delete the record
    await LeaveType.deleteOne({ _id: leaveTypeIdFromTheUrl });

    // Respond with a message (eg: leave deleted)
    res.json({ success: "Leave Deleted" });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// PUT - soft delete leave type

const softDeleteLeaveType = async (req, res) => {
  try {
    // Get the id off the url
    const leaveIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await LeaveType.findOneAndUpdate(
      { _id: leaveIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        // "accepted.acceptedStatus": true,
        deletedStatus: true,
      },
      { new: true } // Returns the updated document
    );

    //   Find updated leave (using it's id)
    const updatedLeave = await LeaveType.findById(leaveIdFromTheUrl);

    // Respond with the updated leave (after finding it)
    res.json({ leaveType: updatedLeave });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
module.exports = {
  createLeaveType,
  fetchAllLeaveTypes,
  deleteLeaveType,
  softDeleteLeaveType,
};
