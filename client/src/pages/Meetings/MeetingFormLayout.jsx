import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import MuiModal from "../../components/MuiModal";
import { useForm, Controller } from "react-hook-form";
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PrimaryButton from "../../components/PrimaryButton";
import dayjs from "dayjs";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { queryClient } from "../../index";
import StyledTextField from "../../components/MUIStyled/StyledTextField";

const MeetingFormLayout = () => {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const locationName = searchParams.get("location") || "";
  const meetingRoomName = searchParams.get("meetingRoom") || "";
  const locationState = useLocation();
  const meetingRoomId = locationState.state?.meetingRoomId || "";
  const [events, setEvents] = useState([]);
  const axios = useAxiosPrivate();
  const navigate = useNavigate();

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      meetingType: "Internal",
      startDate: null, // Ensure null
      endDate: null, // Ensure null
      startTime: null, // Watch startTime dynamically
      endTime: null,
      subject: "",
      agenda: "",
    },
  });

  const meetingType = watch("meetingType");

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await axios.get("/api/users/fetch-users");
      const formattedUsers = response.data.map((user) => ({
        label: user.name,
        id: user._id,
      }));
      console.log(formattedUsers);
      return formattedUsers;
    },
  });

  const {
    data: companies = [],
    isLoading: companiesLoading,
    error: companiesError,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await axios.get("/api/company/get-companies");
      return response.data;
    },
  });

  const { data: checkAvailability = [], isPending: isCheckingAvailability } =
    useQuery({
      queryKey: ["checkAvailability", meetingRoomId],
      queryFn: async () => {
        const response = await axios.get(
          `/api/meetings/get-room-meetings/${meetingRoomId}`
        );
        return response.data;
      },
      onError: (error) => {
        toast.error("Error checking meeting room availability");
      },
    });

  // Transform data inside useEffect
  useEffect(() => {
    transformEvents(checkAvailability);
  }, [checkAvailability]); // ✅ Now using checkAvailability directly

  const transformEvents = (bookings) => {
    if (!Array.isArray(bookings)) return;

    const formattedEvents = bookings.map((booking) => ({
      id: booking._id,
      title: "Booked",
      start: new Date(booking.startDate),
      end: new Date(booking.endDate),
      backgroundColor: "#d3d3d3",
      borderColor: "#a9a9a9",
      textColor: "#555",
      editable: false,
    }));

    setEvents(formattedEvents);
  };

  const {mutate : createMeeting, isPending: isCreateMeeting} = useMutation({
    mutationKey: ["createMeeting"],
    mutationFn: async (data) => {
      await axios.post("/api/meetings/create-meeting", {
        bookedRoom : meetingRoomId,
        meetingType : data.meetingType,
        startDate : data.startDate,
        endDate : data.endDate,
        startTime : data.startTime,
        endTime : data.endTime,
        subject : data.subject,
        agenda : data.agenda
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["meetings"]});
      toast.success("Meeting booked successfully");
      setOpen(false);
      navigate("/app/meetings/calendar");
    },
    onError: () => {
      toast.error("Failed to book meeting");
    },
  });

  const handleDateClick = (arg) => {
    if (!arg.start) return;

    const startTime = dayjs(arg.start); // Keep as a Dayjs object
    const endTime = dayjs(arg.start).add(30, "minute");
    const selectedDate = dayjs(arg.start).startOf("day"); // Get only the date part

    setValue("startDate", selectedDate); // Set only the date
    setValue("endDate", selectedDate); // Set only the date
    setValue("startTime", startTime); // Set the correct format for MUI TimePicker
    setValue("endTime", endTime);

    setOpen(true);
  };

  const onSubmit = (data) => {
    createMeeting(data);
    console.log(data)
  };

  return (
    <div className="p-4">
      <div className="w-full text-center">
        <span className="text-title text-primary font-pregular mb-4">
          Schedule Meeting in {locationName}-{meetingRoomName}
        </span>
      </div>
      <div className="w-full h-full overflow-y-auto">
        {isCheckingAvailability ? (
          <div className="h-full justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          <FullCalendar
            key={events.length}
            headerToolbar={{
              left: "prev title next",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            contentHeight={425}
            dayMaxEvents={2}
            eventDisplay="auto"
            selectable={true}
            selectMirror={false}
            slotDuration="00:30:00"
            slotLabelFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "lowercase", // Ensures "AM/PM" is uppercase
            }}
            allDayText="Full Day"
            select={handleDateClick}
            events={events} // Pass the events state here
          />
        )}
      </div>

      <MuiModal
        open={open}
        onClose={() => setOpen(false)}
        title={`${meetingType} Meeting`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-4"
        >
          <div className="grid grid-cols-2 gap-8 px-2 pb-4 mb-4 border-b-default border-borderGray">
            <div className="flex items-center justify-between">
              <span className="text-content">Location</span>
              <span className="text-content text-gray-500">{locationName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-content">Selected Room</span>
              <span className="text-content text-gray-500">
                {meetingRoomName}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-1 gap-4 gap-y-6">
            <div className="col-span-2">
              <Controller
                name="meetingType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Meeting Type"
                    select
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="">Select a Meeting Type</MenuItem>
                    <MenuItem value="Internal">Internal</MenuItem>
                    <MenuItem value="External">External</MenuItem>
                  </TextField>
                )}
              />
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label={"Select a Start Date"}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                )}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    label={"Select an End Date"}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    slotProps={{ textField: { size: "small" } }}
                    {...field}
                    label={"Select a Start Time"}
                  />
                )}
              />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="endTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    slotProps={{ textField: { size: "small" } }}
                    label={"Select an End Date"}
                    viewRenderers={(params) => (
                      <TextField {...params} fullWidth size="small" />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
            <div className="col-span-2">
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={"Subject"}
                    placeholder="Product Demonstration"
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                  />
                )}
              />
            </div>
            <div className="col-span-2">
              <Controller
                name="agenda"
                control={control}
                render={({ field }) => (
                  <TextField
                    label={"Agenda"}
                    placeholder="Agenda"
                    {...field}
                    fullWidth
                    multiline
                    rows={3}
                    size="small"
                  />
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <PrimaryButton title="Submit" type="submit" disabled={isCreateMeeting} isLoading={isCreateMeeting} />
          </div>
        </form>
      </MuiModal>
    </div>
  );
};

export default MeetingFormLayout;
