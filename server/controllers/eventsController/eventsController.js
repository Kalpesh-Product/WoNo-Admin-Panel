 
const Event = require("../../models/Events");

const createEvent = async (req, res, next) => {
  try {
    const { title, type, description, start, end, participants} = req.body;

    const {company} = req.userData

    const startDate = new Date(start);
    const endDate = new Date(end);
 
    if (!title || !type || !description || !start || !end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const validParticipants = Array.isArray(participants) ? participants : [];

    const newEvent = new Event({
      title,
      type,
      description,
      start: startDate,
      end: endDate,
      participants: validParticipants,
      company
    });

    const event = await newEvent.save();
    res.status(201).json({message:"Event created successfully"});
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
     
    const {company} = req.userData;

    (company)
    const events = await Event.find({company:company});

    if (!events || events.length === 0) {
      return res.status(204).json({ message: "No events found" });
    }

    const eventsData = events.map((event) => {
      return {
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        description: event.description,
        active:event.active,
        backgroundColor: event.type === "Holiday" ? "#4caf50" : (event.type === "Meeting" ? "purple" : (event.type === "task" ? "yellow" : (event.type === "event" ? "blue" : event.type === "Birthday" ?"#ff9800" : ''))),
        extendedProps: {
          type: event.type,
        },
      };
    });


    res.status(200).json(eventsData);
  } catch (error) {
    next(error);
   }
};

const getNormalEvents = async (req, res, next) => {
  try {
    const {company} = req.userData

    const normalEvents = await Event.find({company:company,type:"event"});

    if(!normalEvents || normalEvents.length < 0){
      res.status(400).json({message:"No event found"});
    }
 
    res.status(200).json(normalEvents);
  } catch (error) {
    next(error);
  }
};

const getHolidays = async (req, res, next) => {
  try {
    const {company} = req.userData

    const holidays = await Event.find({company:company,type:"holiday"});

    if(!holidays || holidays.length < 0){
      res.status(400).json({message:"No holiday found"});
    }

    res.status(200).json(holidays);
  } catch (error) {
    next(error);
  }
};

const getBirthdays = async (req, res, next) => {
  try {
    const {company} = req.userData

    const birthdays = await Event.find({company:company,type:"birthday"});

    if(!birthdays || birthdays.length < 0){
      res.status(400).json({message:"No birthday found"});
    }

    res.status(200).json(birthdays);
  } catch (error) {
    next(error);
  }
};

const  extendEvent = async (req,res,next) => {

  const {id,extend} = req.body
  const extendTime = new Date(extend)

  if(!id){
    return res.status(400).json({ message: "EventId is required" });
  }
  if (isNaN(extendTime.getTime())) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  try{
     
  const meetings = await Event.find({type:"holiday"});

  const onGoingMeetings = meetings.some((meeting)=> {
    const startDate = new Date(meeting.start)
    const endDate = new Date(meeting.end)
    ("startDate: ",startDate)
    
    return extendTime > startDate && extendTime < endDate
  })

  if(onGoingMeetings){
    return res.status(400).json({ message: "Cannot extend the  meeting" });
  }
  
  const extendedMeeting = await Event.findOneAndUpdate({_id:id},{end:extendTime},{new:true})

  return res.status(200).json({ message: "Meeting time extended" });

  }
  catch(error){
    next(error)
  }
};


const deleteEvent = async (req,res,next) => {

  const {id} = req.body

  if(!id){
    return res.status(400).json({ message: "EventId is required" });
  }

  try{
     const inActiveEvent = await Event.findOneAndUpdate({_id:id},{active:false},{new:true});
  
    res.status(200).json({message:"Event deleted successfully",data:inActiveEvent});
    
  }
  catch(error){
    ('error:',error)
    next(error)
  }
};




module.exports = { createEvent, getAllEvents, getNormalEvents, getHolidays, getBirthdays, extendEvent,deleteEvent };
