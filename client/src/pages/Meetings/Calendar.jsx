import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { api } from "../../utils/axios";
import "../../pages/LoginPage/CalenderModal.css";

import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const MeetingCalendar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const axios = useAxiosPrivate();

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedEvent(null); // Clear the selected event on close
  };

  // Dummy data for department payments
  const dummyData = [
    {
      department: "View All",
      color: "#8691A3", // Finance color
      payments: [
        { title: "Monthly Meeting", date: "2025-01-10", amount: "$1000" },
        { title: "Meeting With Client", date: "2025-01-15", amount: "$1500" },
      ],
    },
    {
      department: "Cancelled",
      color: "#FD352E", // HR color
      payments: [
        { title: "Db Meeting", date: "2025-01-20", amount: "$5000" },
        { title: "Page layout discussion", date: "2025-01-25", amount: "$800" },
      ],
    },
    {
      department: "Ongoing",
      color: "#7478DE", // Sales color
      payments: [
        {
          title: "Meeting To Discuss workflow of meeting",
          date: "2025-01-12",
          amount: "$2000",
        },
        { title: "Team Meeting", date: "2025-01-18", amount: "$1200" },
      ],
    },
    {
      department: "Upcomming",
      color: "#FAAB02", // Sales color
      payments: [
        {
          title: "Meeting To Discuss workflow of meeting",
          date: "2025-01-12",
          amount: "$2000",
        },
        { title: "Team Meeting", date: "2025-01-18", amount: "$1200" },
      ],
    },
    {
      department: "Completed",
      color: "#72DA36", // Sales color
      payments: [
        {
          title: "Meeting To Discuss workflow of meeting",
          date: "2025-01-12",
          amount: "$2000",
        },
        { title: "Team Meeting", date: "2025-01-18", amount: "$1200" },
      ],
    },
    {
      department: "Extended",
      color: "#05C3F0", // Sales color
      payments: [
        {
          title: "Meeting To Discuss workflow of meeting",
          date: "2025-01-12",
          amount: "$2000",
        },
        { title: "Team Meeting", date: "2025-01-18", amount: "$1200" },
      ],
    },
  ];

  // Combine all payments into a single array for FullCalendar
  //  const events = dummyData.flatMap((dept) =>
  //    dept.payments.map((payment) => ({
  //      title: `${payment.title}`,
  //      start: payment.date,
  //      backgroundColor: dept.color, // Assign department-specific color
  //      borderColor: dept.color,
  //      extendedProps: {
  //        department: dept.department,
  //        amount: payment.amount,
  //        color: dept.color,
  //      },
  //    }))
  //  );

  // Filter events by selected departments

  const { data: meetingsCheck = [] } = useQuery({
    queryKey: ["meetingsCheck"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/meetings/get-meetings");
        return response.data;
      } catch (error) {
        throw new Error(error.response.data.message);
      }
    },
  });

  // Convert meeting data to FullCalendar event format
  const events = meetingsCheck.map((meeting, index) => {
    // Convert date from "DD-MM-YYYY" to "YYYY-MM-DD"
    const [day, month, year] = meeting.date.split("-");
    const formattedDate = `${year}-${month}-${day}`;
  
    // Create valid Date objects
    const start = new Date(`${formattedDate}T${convertTo24Hour(meeting.startTime)}`);
    const end = new Date(`${formattedDate}T${convertTo24Hour(meeting.endTime)}`);
  
    // Define event color based on status
    const eventColor = meeting.status === "Cancelled" ? "#FD352E" : "#05C3F0"; // Red for Cancelled, Blue for others
  
    return {
      id: index.toString(),
      title: `${meeting.roomName} - ${meeting.status}`,
      start, 
      end,   
      backgroundColor: eventColor, // Set event background color
      borderColor: eventColor, // Set border color
      extendedProps: {
        agenda: meeting.agenda,
        internalParticipants: meeting.internalParticipants,
        externalParticipants: meeting.externalParticipants,
        company: meeting.company,
        status: meeting.status,
      },
    };
  });
  

  // Function to convert "12:00 PM" to "12:00" in 24-hour format
  function convertTo24Hour(time) {
    const [timeStr, modifier] = time.split(" ");
    let [hours, minutes] = timeStr.split(":");
    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  console.log(events);

  // Extract unique statuses from API response
  const uniqueStatuses = Array.from(
    new Set(meetingsCheck.map((meeting) => meeting.status))
  );

  // State for event filtering based on status
  const [filteredStatuses, setFilteredStatuses] = useState(uniqueStatuses);

  const filteredEvents = events.filter(
    (event) => filteredStatuses.includes(event.title.split(" - ")[1]) // Extract status from title
  );

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event); // Set the selected event
    setIsDrawerOpen(true); // Open the modal
  };

  return (
    <div className="flex w-[70%] md:w-full">
      <div className="flex-1 p-4 bg-white">
        <div className="flex gap-4 relative w-full">
          <div className="flex flex-col gap-4 w-[25%]">
            <div className="border-2 border-gray-300 rounded-md">
              <div className="w-full flex justify-start border-b-default border-borderGray p-2">
                <span className="text-content font-bold uppercase">
                  Meeting Filters
                </span>
              </div>
              <div className="flex justify-start text-content px-2">
                <FormGroup column>
                  {uniqueStatuses.map((status) => (
                    <FormControlLabel
                      key={status}
                      control={
                        <Checkbox
                          sx={{
                            fontSize: "0.75rem",
                            transform: "scale(0.8)",
                            "&.Mui-checked": { color: "#05C3F0" }, // Change color as needed
                          }}
                          checked={filteredStatuses.includes(status)}
                          onChange={(e) => {
                            const selectedStatus = e.target.value;
                            setFilteredStatuses((prevFilter) =>
                              e.target.checked
                                ? [...prevFilter, selectedStatus]
                                : prevFilter.filter((s) => s !== selectedStatus)
                            );
                          }}
                          value={status}
                        />
                      }
                      label={
                        <span
                          style={{ fontSize: "0.875rem", fontWeight: "bold" }}
                        >
                          {status}
                        </span>
                      }
                    />
                  ))}
                </FormGroup>
              </div>
            </div>

            <div className="border-2 border-gray-300 rounded-md">
              <div className="mb-2 text-content font-bold uppercase border-b-default border-borderGray p-2">
                <span>Today's Meetings</span>
              </div>

              <div className="px-2 max-h-[33.5vh] overflow-y-auto"></div>
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
              contentHeight={520}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={filteredEvents} // Use filtered events
            />
          </div>
        </div>

        {/* <MuiModal
        open={isDrawerOpen}
        onClose={closeDrawer}
        title="Payment Details"
        headerBackground={selectedEvent?.extendedProps.color}
      >
        {selectedEvent && (
          <div>
            <div className="flex flex-col gap-2">
              <span className="text-content flex items-center">
                <span className="w-[30%]">Title</span>
                <span>:</span>
                <span className="text-content font-pmedium w-full justify-start pl-4">
                  {selectedEvent.title}
                </span>
              </span>
              <span className="text-content flex items-center">
                <span className="w-[30%]">Start Date</span>
                <span>:</span>
                <span className="text-content font-pmedium w-full justify-start pl-4">
                  {dayjs(selectedEvent.start).format("YYYY-MM-DD")}
                </span>
              </span>
              <span className="text-content flex items-center">
                <span className="w-[30%]">Department</span>
                <span>:</span>
                <span className="text-content font-pmedium w-full justify-start pl-4">
                  {selectedEvent.extendedProps.department}
                </span>
              </span>
              <span className="text-content flex items-center">
                <span className="w-[30%]">Amount</span>
                <span>:</span>
                <span className="text-content font-pmedium w-full justify-start pl-4">
                  {selectedEvent.extendedProps.amount}
                </span>
              </span>
            </div>
          </div>
        )}
      </MuiModal> */}
      </div>
    </div>
  );
};

export default MeetingCalendar;
