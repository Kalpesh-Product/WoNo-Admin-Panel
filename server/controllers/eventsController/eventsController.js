const Event = require("../../models/Events");

const createEvent = async (req, res, next) => {
  try {
    const { title, type, description, start, end, participants } = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);

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

    if (!title || !type || !description || !start || !end) {
      return res.status(400).json({ message: "All fields are required" });
    }

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

    const transformedEvents = events.map((event) => {
      return {
        id: event._id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        description: event.description,
        backgroundColor: event.type === "holiday" ? "green" : "#5E5F9C",
        extendedProps: {
          type: event.type,
        },
      };
    });

    res.status(200).json(transformedEvents);
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

module.exports = { createEvent, getAllEvents, getNormalEvents, getHolidays };
