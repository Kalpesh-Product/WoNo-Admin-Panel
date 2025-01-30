
const Leave = require("../../models/Leaves");
const User = require("../../models/User");
const mongoose = require("mongoose");
const UserData = require("../../models/UserData");

const requestLeave = async (req, res, next) => {
  try {
   
    const {
      fromDate,
      toDate,
      leaveType,
      leavePeriod,
      hours,
      description,
    } = req.body;
    const loggedInUser = req.user

    if (!fromDate || !toDate || !leaveType || !leavePeriod || !hours || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date(fromDate)
    const endDate = new Date(toDate)


    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const user = await UserData.findById({_id:loggedInUser})

    if(!user){
      return res.status(400).json({message:"User not found"})
    }
 
    const newLeave = new Leave({
      company:user.company,
      takenBy:user._id,
      leaveType,
      fromDate,
      toDate,
      leaveType,
      leavePeriod,
      hours,
      description,
    });

   await newLeave.save();

    return res.status(201).json({message:"Leave request sent"});
  } catch (error) {
   next(error)
  }
};

 
const fetchAllLeaves = async (req, res) => {
  try {

    const user = req.user
    const loggedInUser = await User.findOne({_id:user}).select("company");

      if (!loggedInUser) {
        return res.sendStatus(403) 
      }

    const leaves = await Leave.find({company:loggedInUser.company});
    
     if(!leaves || leaves.length === 0){
      return res.status(204).json({message:"No leaves found"}) 
     }
     
    return res.status(200).json(leaves);
  } catch (error) {
    next(error)
  }
};


const fetchLeavesBeforeToday = async (req, res, next) => {
  try {
     
    const user = req.user
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const loggedInUser = await User.findOne({_id:user}).select("company");

      if (!loggedInUser) {
        return res.sendStatus(403) 
      }

    const leavesBeforeToday = await Leave.find({company:loggedInUser.company,
      createdAt: { $lt: today }
    });

    if(!leavesBeforeToday){
      return res.status(204).json({message:"No leaves found"}) 
    }

    return res.send(200).json(leavesBeforeToday);
  } catch (error) {
    next(error)
  }
};


const approveLeave = async (req, res, next) => {
  try {
  
    const leaveId = req.params.id;
    const user = req.user

    if(!mongoose.Types.ObjectId.isValid(leaveId)){
      return res.status(400).json({message:"Invalid Leave Id provided"})
    }

    const updatedLeave = await Leave.findOneAndUpdate(
      { _id: leaveId },
      {approvedBy:user,
        status: "Approved",
      },
      { new: true }  
    );

    if(!updatedLeave){
      return res.status(400).json({message: "No such leave exists"})
    }
 
    return res.status(200).json({ message:"Leave Approved"});
  } catch (error) {
    next(error)
  }
};

 
const rejectLeave = async (req, res, next) => {
  try {
  
    const leaveId = req.params.id;
    const user = req.user
 
    if(!mongoose.Types.ObjectId.isValid(leaveId)){
      return res.status(400).json({message:"Invalid Leave Id provided"})
    }

    const updatedLeave = await Leave.findOneAndUpdate(
        {_id: leaveId,
          approvedBy:user},
      {status: "Rejected",}
    );

    if(!updatedLeave){
      return res.status(400).json({message: "No such leave exists"})
    }

    return res.status(200).json({ message: "Leave rejected" });
  } catch (error) {
    next(error)
  }
};

module.exports = {
  requestLeave,
  fetchAllLeaves,
  fetchLeavesBeforeToday,
  approveLeave,
  rejectLeave,
};
