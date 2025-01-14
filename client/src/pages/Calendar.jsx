import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "../utils/axios";
import "../pages/LoginPage/CalenderModal.css";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import dayjs from "dayjs";
import { IoMdClose } from "react-icons/io";

const Calender = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState(""); // 'view' or 'add'
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    description: "",
  });
  const [eventFilter, setEventFilter] = useState(["holiday", "event"]);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const response = await api.get("/api/events/all-events");
        setEvents(response.data);
      } catch (error) {
        toast.error(error.message);
        return [];
      }
    };
    getEvents();
  }, []);

  useEffect(() => {
    if (eventFilter.length === 0) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) =>
        eventFilter.includes(event.extendedProps?.type.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [eventFilter, events]);

  const getTodaysEvents = () => {
    const today = dayjs().startOf("day");
    return events.filter((event) => {
      const eventStart = dayjs(event.start).startOf("day");
      const eventEnd = dayjs(event.end).startOf("day");
      return today.isSame(eventStart) || (today.isAfter(eventStart) && today.isBefore(eventEnd));
    });
  };

  const todaysEvents = getTodaysEvents();

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setDrawerMode("view");
    setIsDrawerOpen(true);
  };

  const handleDateClick = (info) => {
    setNewEvent({
      title: "",
      start: dayjs(info.date).format("YYYY-MM-DD"),
      description: "",
    });
    setDrawerMode("add");
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      start: "",
      description: "",
    });
  };

  const handleSaveEvent = () => {
    console.log("New Event:", newEvent);
    closeDrawer();
  };

  return (
    <div className="flex w-[70%] md:w-full">
      <div className="flex-1 p-4 bg-white">
        <div className="flex gap-4 relative w-full">
          <div className="flex flex-col gap-4 w-[25%]">
            <div className="border-2 border-gray-300 p-4 rounded-md">
              <div className="w-full flex justify-start ">
                <span className="text-content font-bold uppercase">
                  Event Filters
                </span>
              </div>
              <div className="flex justify-start text-content ">
                <FormGroup column>
                  {["holiday", "event"].map((type) => {
                    const colors = {
                      holiday: "#4caf50",
                      event: "#ff9800",
                    };
                    return (
                      <FormControlLabel
                        key={type}
                        control={
                          <Checkbox
                            sx={{
                              fontSize: "0.75rem",
                              transform: "scale(0.8)",
                              color: colors[type],
                              "&.Mui-checked": { color: colors[type] },
                            }}
                            checked={eventFilter.includes(type)}
                            onChange={(e) => {
                              const selectedType = e.target.value;
                              setEventFilter((prevFilter) =>
                                e.target.checked
                                  ? [...prevFilter, selectedType]
                                  : prevFilter.filter((t) => t !== selectedType)
                              );
                            }}
                            value={type}
                          />
                        }
                        label={
                          <span style={{ fontSize: "0.875rem" }}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                        }
                      />
                    );
                  })}
                </FormGroup>
              </div>
            </div>

            <div className="border-2 border-gray-300 p-4 rounded-md">
              <div className="mb-2 text-content font-bold uppercase">
                Today's Schedule
              </div>
              {todaysEvents.length > 0 ? (
                todaysEvents.map((event, index) => {
                  const colors = {
                    holiday: "#4caf50",
                    event: "#ff9800",
                  };
                  return (
                    <div key={index} className="flex gap-2 items-center mb-2">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor: colors[event.extendedProps.type],
                        }}
                      ></div>
                      <div className="flex flex-col">
                        <span className="text-content font-medium">
                          {event.title}
                        </span>
                        <span className="text-small text-gray-500">
                          {event.start
                            ? dayjs(event.start).format("h:mm A")
                            : "All Day"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <span>No events today.</span>
              )}
            </div>
          </div>
          <div className="w-full h-full overflow-y-auto">
            <FullCalendar
              headerToolbar={{
                left: "today",
                center: "prev title next",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              dayMaxEvents={2}
              eventDisplay="block"
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={filteredEvents}
            />
          </div>
        </div>

        <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
          <Box sx={{ width: 350, padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                {drawerMode === "view" ? "Event Details" : "Add New Event"}
              </Typography>
              <IconButton onClick={closeDrawer}>
                <IoMdClose />
              </IconButton>
            </Box>

            {drawerMode === "view" && selectedEvent && (
              <Box mt={2}>
                <Typography variant="subtitle1">
                  <strong>Title:</strong> {selectedEvent.title}
                </Typography>
                <Typography variant="body2">
                  <strong>Start Date:</strong>{" "}
                  {dayjs(selectedEvent.start).format("YYYY-MM-DD")}
                </Typography>
                {selectedEvent.extendedProps.description && (
                  <Typography variant="body2" mt={1}>
                    <strong>Description:</strong>{" "}
                    {selectedEvent.extendedProps.description}
                  </Typography>
                )}
              </Box>
            )}

            {drawerMode === "add" && (
              <Box mt={2}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent((prev) => ({ ...prev, title: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Start Date"
                  variant="outlined"
                  fullWidth
                  value={newEvent.start}
                  disabled
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={3}
                  fullWidth
                  value={newEvent.description}
                  onChange={(e) =>
                    setNewEvent((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleSaveEvent}>
                  Save Event
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>
      </div>
    </div>
  );
};

export default Calender;
