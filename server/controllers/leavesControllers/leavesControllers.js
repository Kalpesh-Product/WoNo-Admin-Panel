
const Leave = require("../../models/Leaves");

const bcrypt = require("bcryptjs");

const createLeave = async (req, res) => {
  try {
   
    const {
      leaveId,
      takenBy,
      fromDate,
      toDate,
      leaveType,
      leavePeriod,
      hours,
      description,
      status,
      approvedBy,
    } = req.body;
 
    const newLeave = new Leave({
      leaveId,
      takenBy,
      leaveType,
      takenBy,
      fromDate,
      toDate,
      leaveType,
      leavePeriod,
      hours,
      description,
      status,
      approvedBy,
    });

    const savedLeaved = await newLeave.save();

    return res.status(201).json(savedLeaved);
  } catch (error) {
    console.log(error);
  }
};

 
const fetchAllLeaves = async (req, res) => {
  try {
    
    const listOfAllLeaves = await Leave.find();
     
    return res.status(200).json({ leaves: listOfAllLeaves });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// GET - Fetch leaves before today
const fetchLeavesBeforeToday = async (req, res) => {
  try {
    // Get today's date and set time to the start of the day
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the leaves before today
    const leavesBeforeToday = await Leave.find({
      createdAt: { $lt: today },
    });

    // Respond with the filtered leaves
    res.json({ leaves: leavesBeforeToday });
  } catch (error) {
    console.error(error);
    res.sendStatus(400);
  }
};

// PUT - Approve leave
const approveLeave = async (req, res) => {
  try {
    // Get the id off the url
    const leaveIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Leave.findOneAndUpdate(
      { _id: leaveIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        // "accepted.acceptedStatus": true,
        status: "Approved",
      },
      { new: true } // Returns the updated document
    );

    //   Find updated leave (using it's id)
    const updatedLeave = await Leave.findById(leaveIdFromTheUrl);

    // Respond with the updated leave (after finding it)
    res.json({ leave: updatedLeave });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// PUT - Reject leave
const rejectLeave = async (req, res) => {
  try {
    // Get the id off the url
    const leaveIdFromTheUrl = req.params.id;

    // Get the data off the req body
    // const assignedMemberFromRequestBody = req.body.assignedMember;
    // const descriptionFromRequestBody = req.body.description;

    // Find and update the record
    await Leave.findOneAndUpdate(
      { _id: leaveIdFromTheUrl },
      {
        // assignedMember: assignedMemberFromRequestBody,
        // description: descriptionFromRequestBody,
        // "accepted.acceptedStatus": true,
        status: "Rejected",
      },
      { new: true } // Returns the updated document
    );

    //   Find updated leave (using it's id)
    const updatedLeave = await Leave.findById(leaveIdFromTheUrl);

    // Respond with the updated leave (after finding it)
    res.json({ leave: updatedLeave });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

// TEST USER ROUTES END

module.exports = {
  createLeave,
  fetchAllLeaves,
  fetchLeavesBeforeToday,
  approveLeave,
  rejectLeave,
};
