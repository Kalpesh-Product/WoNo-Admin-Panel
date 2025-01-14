const Event = require("../../models/Events");

const createEvent = async (req, res, next) => {
  try {
    const { title, type, description, start, end, participants } = req.body;

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
    });

    const event = await newEvent.save();
    res.status(201).json({ event });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    // Fetch all events from the database
    const events = await Event.find();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
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
        backgroundColor: event.type === "holiday" ? "green" : (event.type === "meeting" ? "purple" : (event.type === "tasks" ? "yellow" : (event.type === "events" ? "blue" : ""))),
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
    const normalEvents = await Event.find();
    const filteredEvents = normalEvents.filter(
      (event) => event.type === "event"
    );
    res.status(200).json(filteredEvents);
  } catch (error) {
    next(error);
  }
};

const getHolidays = async (req, res, next) => {
  try {
    const normalEvents = await Event.find();
    const filteredEvents = normalEvents.filter(
      (event) => event.type === "holiday"
    );
    res.status(200).json(filteredEvents);
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
    console.log("startDate: ",startDate)
    
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
    console.log('error:',error)
    next(error)
  }
};




module.exports = { createEvent, getAllEvents, getNormalEvents, getHolidays,extendEvent,deleteEvent };
