const Attendance = require("../models/Attendance")

const recordAttendance = async(req,res,next)=>{

    const {inTime,outTime,breakHours,entryType} = req.body
    const loggedInUser = req.user

    try {

        if(!inTime || !outTime || !breakHours || !entryType){
            return res.status(400).json({message:"All fields are required"})
        }

        const clockIn = new Date(inTime)
        const clockOut = new Date(outTime)

        if(isNaN(breakHours)){
            return res.status(400).json({message:"Hours should be in digits"})
        }
        if(isNaN(clockIn.getTime()) || isNaN(clockOut.getTime()) ){
            return res.status(400).json({message:"Invalid date format"})
        }

        const newAttendance = new Attendance({
            inTime:clockIn,outTime:clockOut,breakHours,entryType:entryType.toLowerCase(),user:loggedInUser
        })

        await newAttendance.save()
        return res.status(201).json({message:"Attendance recorded"})

    } catch (error) {
        next(error)
    }

}

const getAttendance = async(req,res,next)=>{

    const loggedInUser = req.user

    try {

        const attendance = await Attendance.find({user:loggedInUser})
        return res.status(200).json(attendance)

    } catch (error) {
        next(error)
    }

}

const correctAttendance = async(req,res,next)=>{

    const loggedInUser = req.user
    const {targetedDay,inTime,outTime} = req.body
    const clockIn = inTime ? new Date(inTime) : null;
    const clockOut = outTime ? new Date(outTime) : null;

    try {

        if(!targetedDay){
            return res.status(400).json({message:"Correction Day is required"})
        }

        const targetedDate = new Date(targetedDay)
        const targetDateOnly = new Date(targetedDate.getUTCFullYear(), targetedDate.getUTCMonth(), targetedDate.getUTCDate());

      
        if(isNaN(targetedDate.getTime()) || inTime && isNaN(clockIn.getTime()) || outTime && isNaN(clockOut.getTime())){
            return res.status(400).json({message:"Invalid Date format"})
        }

       
        const foundDate = await Attendance.findOne({createdAt: { $gte: targetDateOnly, $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000) }})

        if(!foundDate){
            return res.status(400).json({message:"No timeclock found for the date"})
        }

        const updateTimeClock = {
            inTime: clockIn,
            outTime: outTime ? clockOut : foundDate.outTime,
        }
      
        await Attendance.findOneAndUpdate({createdAt: { $gte: targetDateOnly, $lt: new Date(targetDateOnly.getTime() + 24 * 60 * 60 * 1000) }},{$set: updateTimeClock})
 
        return res.status(200).json({message:"Attendance corrected"})

    } catch (error) {
        next(error)
    }

}

module.exports = {recordAttendance,getAttendance,correctAttendance}