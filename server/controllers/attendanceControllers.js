const { default: mongoose } = require("mongoose")
const Attendance = require("../models/Attendance")
const UserData = require("../models/UserData")

const clockIn = async(req,res,next)=>{

    const {inTime,entryType} = req.body
    const loggedInUser = req.user

    try {
        if(!inTime || !entryType){
            return res.status(400).json({message:"All fields are required"})
        }

        const clockIn = new Date(inTime)
 
        if(isNaN(clockIn.getTime())){
            return res.status(400).json({message:"Invalid date format"})
        }

        const user = await UserData.findById({"_id":loggedInUser})

        const newAttendance = new Attendance({
            inTime:clockIn,
            entryType,
            user:user._id,
            company:user.company
        })

        await newAttendance.save()
        return res.status(201).json({message:"You clocked in"})

    } catch (error) {
        next(error)
    }

}

const clockOut = async(req,res,next)=>{

    const {outTime,attendanceId} = req.body

    try {

        if(!outTime){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!mongoose.Types.ObjectId.isValid(attendanceId)){
            return res.status(400).json({message:"Invalid Id provided"})
        }

        const clockOut = new Date(outTime)
        if(isNaN(clockOut.getTime())){
            return res.status(400).json({message:"Invalid date format"})
        }

        // const attendance = await Attendance.findById({_id:attendanceId})

        // if(!attendance){
        //     return res.status(400).json({message:"No clock in record exists"})
        // }

        // let breakHours = 0
        // if (attendance.startBreak && attendance.endBreak){
        //     breakHours = ( attendance.endBreak - attendance.startBreak) / (1000 * 60)
        //     console.log('break',breakHours)

        // }
       
        const updatedAttendance = await Attendance.findByIdAndUpdate({_id:attendanceId},{outTime:clockOut},{new:true})

        if(!updatedAttendance){
            return res.status(400).json({message:"No clock in record exists"})
        }

        return res.status(200).json({message:"You clocked out"})

    } catch (error) {
        next(error)
    }

}

const startBreak = async(req,res,next)=>{

    const {startBreak,attendanceId} = req.body

    try {
        if(!startBreak){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!mongoose.Types.ObjectId.isValid(attendanceId)){
            return res.status(400).json({message:"Invalid Id provided"})
        }

        const startBreakTime = new Date(startBreak)
        if(isNaN(startBreakTime.getTime())){
            return res.status(400).json({message:"Invalid date format"})
        }

        const updatedAttendance = await Attendance.findByIdAndUpdate({_id:attendanceId},{startBreak:startBreakTime,endBreak:null},{new:true})

        if(!updatedAttendance){
            return res.status(400).json({message:"No clock in record exists"})
        }

        return res.status(200).json({message:"Break started"})
    } catch (error) {
        next(error)
    }

}

const endBreak = async(req,res,next)=>{

    const {endBreak,attendanceId} = req.body

    try {
        if(!endBreak){
            return res.status(400).json({message:"All fields are required"})
        }

        if(!mongoose.Types.ObjectId.isValid(attendanceId)){
            return res.status(400).json({message:"Invalid Id provided"})
        }

        const endBreakTime = new Date(endBreak)
        if(isNaN(endBreakTime.getTime())){
            return res.status(400).json({message:"Invalid date format"})
        }

        const attendance = await Attendance.findById({_id:attendanceId})

        if(!attendance){
            return res.status(400).json({message:"No clock in record exists"})
        }
  
        const startBreakTime = new Date(attendance.startBreak)

        const breakDuration = (endBreakTime - startBreakTime)/ (1000 * 60) + attendance.breakDuration

        const updatedAttendance = await Attendance.findByIdAndUpdate(
        {_id:attendanceId},
        {endBreak:endBreakTime,
        breakDuration},
        {new:true})

        if(!updatedAttendance){
            return res.status(400).json({message:"No clock in record exists"})
        }

        return res.status(200).json({message:"Break ended"})
    } catch (error) {
        next(error)
    }

}

const getAllAttendance = async(req,res,next)=>{

    const loggedInUser = req.user

    try {
        const user = await UserData.findById({"_id":loggedInUser}).populate({path:"role", select:'roleTitle'})

        const validRoles = ["Master Admin", "Super Admin", "HR Admin"]

        const hasPermission = user.role.some((role) => validRoles.includes(role.roleTitle))

        if(!hasPermission){
            return res.status(400).json({message:"User not authenticated"})
        }
        
        let attendances = []
        attendances = await Attendance.find({company:user.company})

        if(!attendances){
            return res.status(400).json({message:"No attendance exists"})
        }

        return res.status(200).json(attendances)

    } catch (error) {
        next(error)
    }

}

const getAttendance = async(req,res,next)=>{

    const loggedInUser = req.user

    try {

        const user = await UserData.findById({"_id":loggedInUser}).populate({path:"role", select:'roleTitle'})

        const attendances = await Attendance.find({user:loggedInUser, 
         company:user.company
        })

        if(!attendances){
            return res.status(400).json({message:"No attendance exists"})
        }

        return res.status(200).json(attendances)

    } catch (error) {
        next(error)
    }

}

const correctAttendance = async(req,res,next)=>{
 
    const {targetedDay,inTime,outTime} = req.body
    const clockIn = inTime ? new Date(inTime) : null;
    const clockOut = outTime ? new Date(outTime) : null;

    try {

        if(!targetedDay){
            return res.status(400).json({message:"Correction Day is required"})
        }

        const targetedDate = new Date(targetedDay)
        const targetDateOnly = new Date(targetedDate.getUTCFullYear(), targetedDate.getUTCMonth(), targetedDate.getUTCDate());

        if(isNaN(targetedDate.getTime())){
            return res.status(400).json({message:"Invalid Date format"})
        }
        if(inTime && isNaN(clockIn.getTime())){
            return res.status(400).json({message:"Invalid Date format"})
        }
        if(outTime && isNaN(clockOut.getTime())){
            return res.status(400).json({message:"Invalid Date format"})
        }

        const foundDate = await Attendance.findOne({createdAt: { $gte: targetDateOnly, $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000) }})

        if(!foundDate){
            return res.status(400).json({message:"No timeclock found for the date"})
        }

        const updateTimeClock = {
            inTime: clockIn ? clockIn : foundDate.inTime,
            outTime: clockOut ? clockOut : foundDate.outTime
        }
      
        await Attendance.findOneAndUpdate({createdAt: { $gte: targetDateOnly, $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000) }},{$set: updateTimeClock})
 
        return res.status(200).json({message:"Attendance corrected"})

    } catch (error) {
        next(error)
    }

}

module.exports = {clockIn,clockOut,startBreak,endBreak,getAllAttendance,getAttendance,correctAttendance}