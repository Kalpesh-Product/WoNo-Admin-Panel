
const Leave = require("../../models/Leaves");
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
    const loggedInUser = req.userData.userId
  
    const company = req.userData.company

    if (!fromDate || !toDate || !leaveType || !leavePeriod || !hours || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date(fromDate)
    const endDate = new Date(toDate)
    const currDate = new Date()

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    if(startDate < currDate){
      return res.status(400).json({ message: "Please select future date" });
    }

    const user = await UserData.findById({_id: loggedInUser}).populate({path: "company", select: "employeeTypes"})

    const leaves = await Leave.find({takenBy: loggedInUser,leaveType})

    if(leaves){

       const singleLeaves = leaves.filter((leave)=> leave.leavePeriod === "Single")
       const singleLeaveHours = singleLeaves.length * 9
      
       const partialLeaveHours = leaves
       .filter((leave)=> leave.leavePeriod === "Partial")
       .reduce((acc,leave)=> acc + leave.hours,0) 

       console.log('single',singleLeaveHours)
       console.log('partialLeaveHours',partialLeaveHours)

       const grantedLeaves  = user.employeeType.leavesCount.find((leave)=> {
        return leave.leaveType.toLowerCase() === leaveType.toLowerCase()
       })

       const grantedLeaveHours = grantedLeaves.count * 9
       const takenLeaveHours = singleLeaveHours + partialLeaveHours
       console.log('grantedLeaveHours',grantedLeaveHours)
       console.log('taken',takenLeaveHours)
       
       if(takenLeaveHours > grantedLeaveHours){
        return res.status(400).json({message: "Can't request more leaves"})
       }
    }

    const noOfDays = Math.abs((currDate.getTime() - startDate.getTime() ) / (1000 * 60 * 60 * 24));
  
    let updatedLeaveType = ""
    if(leaveType === "Privileged Leave" && noOfDays < 7){
      console.log(noOfDays)
      updatedLeaveType = "Abrupt Leave"
    }

    const newLeave = new Leave({
      company,
      takenBy:loggedInUser,
      leaveType:updatedLeaveType ? updatedLeaveType : leaveType,
      fromDate,
      toDate,
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

 
const fetchAllLeaves = async (req, res, next) => {
  try {

    const user = req.user
    const loggedInUser = await UserData.findOne({_id:user}).select("company");

    const leaves = await Leave.find();
    
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

    const loggedInUser = await UserData.findOne({ _id:user}).select("company");

      if (!loggedInUser) {
        return res.sendStatus(403) 
      }

    const leavesBeforeToday = await Leave.find({
      fromDate: { $lt: today }
    });

    if(!leavesBeforeToday){
      return res.status(204).json({message:"No leaves exists"}) 
    }

    console.log(leavesBeforeToday)

    return res.status(200).json(leavesBeforeToday);
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
      {
        $set: { status: "Approved", approvedBy: user },  
        $unset: { rejectedBy: "" },  
      },
      { new: true }  
    );

    if(!updatedLeave){
      return res.status(400).json({message: "Couldn't approve the leave request"})
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
        {_id: leaveId},
        {
          $set: { status: "Rejected", rejectedBy: user },
          $unset: { approvedBy: "" },
        },
        {new: true}
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
