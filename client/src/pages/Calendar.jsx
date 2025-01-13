import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
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
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    description: "",
  });
  const [eventFilter, setEventFilter] = useState([
    "View All",
    "Meetings",
    "Holidays",
    "Events",
  ]);
  //   const { data: eventsData } = useQuery({
  //     queryKey: ["events"],
  //     queryFn: async () => {
  //       try {
  //         const response = await api.get("/api/events/all-events");
  //         return response.data;
  //       } catch (error) {
  //         toast.error(error.message);
  //         return [];
  //       }
  //     },
  //   });

  //   const { mutate } = useMutation({
  //     mutationFn: async function () {
  //       try {
  //         await api.post("/api/events/create-event", {
  //           ...eventDetails,
  //           start: eventDetails.startDate.toISOString(),
  //           end: eventDetails.endDate.toISOString(),
  //         });
  //       } catch (error) {
  //         throw new Error(error.response.data.message);
  //       }
  //     },
  //     onSuccess: function () {
  //       queryClient.invalidateQueries("events");
  //       toast.success("Event created successfully");

  //       setShowModal(false);
  //       setEventDetails({
  //         title: "",
  //         description: "",
  //         startDate: dayjs(),
  //         endDate: dayjs(),
  //         type: "event",
  //       });
  //     },
  //     onError: function (error) {
  //       toast.error(error.message);
  //     },
  //   });
  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     setEventDetails((prev) => ({ ...prev, [name]: value }));
  //   };

  //   const handleDateChange = (field, newValue) => {
  //     setEventDetails((prev) => ({ ...prev, [field]: newValue }));
  //   };

  //   useEffect(() => {
  //     if (eventFilter.length === 0) {
  //       setFilteredEvents(events);
  //     } else {
  //       const filtered = events.filter((event) =>
  //         eventFilter.includes(event.extendedProps?.type.toLowerCase())
  //       );
  //       setFilteredEvents(filtered);
  //     }
  //   }, [eventFilter, events]);

  //   const handleModalClose = () => {
  //     setShowModal(false);
  //     setEventDetails({
  //       title: "",
  //       description: "",
  //       startDate: dayjs(),
  //       endDate: dayjs(),
  //       type: "event",
  //     });
  //   };

  //   const handleEventClick = (info) => {
  //     const startDate = format(new Date(info.event.start), "do MMMM yyyy");
  //     const endDate = info.event.end
  //       ? format(new Date(info.event.end), "do MMMM yyyy")
  //       : startDate;

  //     setSelectedEvent({
  //       title: info.event.title,
  //       description: info.event.extendedProps.description,
  //       start: startDate,
  //       end: endDate,
  //       type: info.event.extendedProps.type,
  //     });
  //     setShowEventDetails(true);
  //   };

  //   useEffect(() => {
  //     if (eventsData) {
  //       setEvents(eventsData);
  //     }
  //   }, [eventsData]);

  // Function to handle event clicks
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setDrawerMode("view");
    setIsDrawerOpen(true);
  };

  // Function to handle date clicks
  const handleDateClick = (info) => {
    setNewEvent({
      title: "",
      start: dayjs(info.date).format("YYYY-MM-DD"),
      description: "",
    });
    setDrawerMode("add");
    setIsDrawerOpen(true);
  };

  // Function to close the drawer
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      start: "",
      description: "",
    });
  };

  // Function to handle new event save
  const handleSaveEvent = () => {
    console.log("New Event:", newEvent);
    // Add logic to save the event (e.g., API call or update events array)
    closeDrawer();
  };

  return (
    <div className="flex w-[70%] md:w-full">
      <div className="flex-1 p-4 bg-white">
        <div className="flex gap-4 relative w-full">
          <div className="flex flex-col gap-4 w-[25%]">
            <div className="border-2 border-gray-300 p-4">
              <div className="w-full flex justify-start ">
                <span className="text-content font-bold uppercase">
                  Event Filters
                </span>
              </div>
              <div className="flex justify-start text-content">
                <FormGroup column>
                  {["View All", "Meetings", "Holidays", "Events"].map(
                    (type, index) => {
                      const colors = {
                        "View All": "#f44336",
                        Meetings: "#2196f3",
                        Holidays: "#4caf50",
                        Events: "#ff9800",
                      };
                      return (
                        <FormControlLabel
                          key={type}
                          control={
                            <Checkbox
                              sx={{
                                fontSize: "0.75rem",
                                transform: "scale(0.8)", // Adjusts the checkbox size
                                color: colors[type],
                                "&.Mui-checked": {
                                  color: colors[type],
                                },
                              }}
                              checked={eventFilter.includes(type)}
                              onChange={(e) => {
                                const selectedType = e.target.value;
                                setEventFilter((prevFilter) =>
                                  e.target.checked
                                    ? [...prevFilter, selectedType]
                                    : prevFilter.filter(
                                        (t) => t !== selectedType
                                      )
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
                    }
                  )}
                </FormGroup>
              </div>
            </div>

            <div className="border-2 border-gray-300 p-4">
              <div className="mb-2 text-content font-bold">
                Today's Schedule
              </div>
              {[
                {
                  type: "Meetings",
                  title: "Team Standup",
                  timing: "10:00 AM - 10:30 AM",
                },
                { type: "Holidays", title: "Christmas Eve", timing: "All Day" },
                {
                  type: "Events",
                  title: "Product Launch",
                  timing: "02:00 PM - 04:00 PM",
                },
                {
                  type: "Meetings",
                  title: "Client Call",
                  timing: "04:30 PM - 05:00 PM",
                },
              ].map((event, index) => {
                const colors = {
                  "View All": "#f44336",
                  Meetings: "#2196f3",
                  Holidays: "#4caf50",
                  Events: "#ff9800",
                };
                return (
                  <div key={index} className="flex gap-2 items-center mb-2">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: colors[event.type] }}></div>
                    <div className="flex flex-col">
                      <span className="text-content font-medium">
                        {event.title}
                      </span>
                      <span className="text-small text-gray-500">
                        {event.timing}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full h-[80vh] overflow-y-auto">
            <FullCalendar
              headerToolbar={{
                left: "today",
                center: "prev title next",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              dayMaxEvents={2}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventBackgroundColor=""
              evenTex
              displayEventTime={false}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              eventDisplay="block"
              weekends={true}
              // dateClick={(info) => {
              //   const clickedDate = dayjs(info.date).startOf("day");
              //   setSelectedDate(info.dateStr);
              //   setShowModal(true);
              //   setEventDetails((prev) => ({
              //     ...prev,
              //     startDate: clickedDate,
              //     endDate: clickedDate,
              //   }));
              // }}
              // events={filteredEvents}
              events={[
                {
                  id: "1",
                  title: "Event 1",
                  start: "2025-01-10",
                  description: "Description for Event 1",
                },
                {
                  id: "2",
                  title: "Event 2",
                  start: "2025-01-12",
                  description: "Description for Event 2",
                },
              ]}
            />
          </div>
        </div>

        <Drawer anchor="right" open={isDrawerOpen} onClose={closeDrawer}>
          <Box
            sx={{
              width: 350,
              padding: 3,
              display: "flex",
              flexDirection: "column",
            }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveEvent}>
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
