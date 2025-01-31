import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useSearchParams } from "react-router-dom";
import MuiModal from "../../components/MuiModal";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PrimaryButton from "../../components/PrimaryButton";
import dayjs from "dayjs";
import { toast } from "sonner";

const MeetingFormLayout = () => {
  const [open, setOpen] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [searchParams] = useSearchParams();
  const location = searchParams.get("location");
  const meetingRoom = searchParams.get("meetingRoom");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!location || !meetingRoom) {
      alert("Missing required parameters. Redirecting...");
      window.location.href = "/";
    }
  }, [location, meetingRoom]);

  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      meetingType: "Internal",
      location: location,
      meetingRoom: meetingRoom,
      date: null,
      startTime: null, // Watch startTime dynamically
      endTime: null,
      companyName: "",
      personName: "",
      registeredCompanyName: "",
      companyUrl: "",
      anotherCompanyUrl: "",
      emailId: "",
      mobileNo: "",
      gst: "",
      pan: "",
      Address: "",
      bookingFor: "",
      subject: "",
      agenda: "",
    },
  });

  const handleDateClick = (arg) => {
    if (!arg.start) return;

    const startTime = dayjs(arg.start); // Keep as a Dayjs object
    const endTime = dayjs(arg.start).add(30, "minute");
    const selectedDate = dayjs(arg.start).startOf("day"); // Get only the date part
    setValue("date", selectedDate); // Set only the date
    setValue("startTime", startTime); // Set the correct format for MUI TimePicker
    setValue("endTime", endTime);

    setSelectedStartTime(startTime);
    setSelectedEndTime(endTime);
    setOpen(true);
  };


  const meetingType = watch("meetingType");

  const onSubmit = (data) => {

    // Create a new event object
    const newEvent = {
      title: data.subject || "Meeting", // Use the subject or a default title
      start: data.startTime.toISOString(), // Convert Dayjs object to ISO string
      end: data.endTime.toISOString(), // Convert Dayjs object to ISO string
      allDay: false,
      extendedProps: {
        location: data.location,
        meetingRoom: data.meetingRoom,
        agenda: data.agenda,
        personName: data.personName,
        companyName: data.companyName,
      },
    };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    setOpen(false);
    toast.success("Meeting booked")
  };

  return (
    <div className="p-4">
      <div className="w-full text-center">
        <span className="text-title text-primary font-pregular mb-4">
          Schedule Meeting in {location}-{meetingRoom}
        </span>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <FullCalendar
          headerToolbar={{
            left: "prev title next",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          contentHeight={425}
          dayMaxEvents={2}
          eventDisplay="block"
          selectable={true}
          selectMirror={true}
          select={handleDateClick}
          events={events} // Pass the events state here
        />
      </div>

      <MuiModal
        open={open}
        onClose={() => setOpen(false)}
        title={`${meetingType} Meeting`}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col px-8 w-full gap-4"
        >
          {/* Two Input Fields */}
          <div className="flex gap-4">
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Location"
                  variant="outlined"
                />
              )}
            />
            <Controller
              name="meetingRoom"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Meeting Room"
                  variant="outlined"
                />
              )}
            />
          </div>

          {/* Date Picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DesktopDatePicker
                  label="Select Date"
                  value={field.value ? dayjs(field.value) : null} // Ensure it's a Dayjs object
                  onChange={(newValue) => field.onChange(newValue)}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              )}
            />
          </LocalizationProvider>

          {/* Start & End Time */}
          <div className="flex gap-4 mb-4">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="startTime"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Start Time"
                    value={field.value ? dayjs(field.value) : null} // Ensure it's a Dayjs object
                    onChange={(newValue) => field.onChange(newValue)}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
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
                    label="End Time"
                    {...field}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                )}
              />
            </LocalizationProvider>
          </div>

          {/* Meeting Type Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Meeting Type</InputLabel>
            <Controller
              name="meetingType"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Meeting Type">
                  <MenuItem value="Internal">Internal</MenuItem>
                  <MenuItem value="External">External</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          {/* Conditional Inputs Based on Meeting Type */}
          {meetingType === "Internal" ? (
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <FormControl fullWidth>
                  <InputLabel>Company Name</InputLabel>
                  <Controller
                    name="companyName"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Company Name">
                        <MenuItem value={1}>Option 1</MenuItem>
                        <MenuItem value={2}>Option 2</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
                <Controller
                  name="personName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Person Name"
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex gap-4">
                <Controller
                  name="companyName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Company Name"
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  name="personName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Person Name"
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Controller
                  name="registeredCompanyName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Registered Company Name"
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  name="companyUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Company URL"
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Controller
                  name="anotherCompanyUrl"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Another Company URL"
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  name="emailId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email ID"
                      variant="outlined"
                    />
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Controller
                  name="mobileNo"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Mobile No"
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  name="gst"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="GST"
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="flex gap-4">
                <Controller
                  name="pan"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="PAN"
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  name="Address"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Address"
                      variant="outlined"
                    />
                  )}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <FormControl fullWidth>
              <InputLabel>Booking For</InputLabel>
              <Controller
                name="bookingFor"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Booking For">
                    <MenuItem value={1}>Option 1</MenuItem>
                    <MenuItem value={2}>Option 2</MenuItem>
                  </Select>
                )}
              />
            </FormControl>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Subject"
                  variant="outlined"
                />
              )}
            />
            <Controller
              name="agenda"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Agenda"
                  variant="outlined"
                />
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <PrimaryButton
              title="Submit"
              type="submit"
              fontSize="text-content"
              externalStyles="mt-4 w-48"
            />
          </div>
        </form>
      </MuiModal>
    </div>
  );
};

export default MeetingFormLayout;
