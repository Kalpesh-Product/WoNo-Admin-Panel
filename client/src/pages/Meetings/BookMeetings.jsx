import React, { useEffect, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
} from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const BookMeetings = () => {
  const navigate = useNavigate();
  const axios = useAxiosPrivate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit: "",
      meetingRoom: "",
    },
  });

  const watchFields = watch();

  const selectedLocation = watch("location");

  // Fetch Work Locations
  const {
    data: workLocations = [],
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: ["workLocations"],
    queryFn: async () => {
      const response = await axios.get(
        "/api/company/get-company-data?field=workLocations"
      );
      console.log(response.data.workLocations);
      return response.data.workLocations;
    },
  });

  // Fetch all Meeting Rooms
  const {
    data: allMeetingRooms = [],
    isLoading: meetingRoomsLoading,
    error: meetingRoomsError,
  } = useQuery({
    queryKey: ["meetingRooms"],
    queryFn: async () => {
      const response = await axios.get("/api/meetings/get-rooms");
      console.log(response.data);
      return response.data;
    },
  });

  // Filter meeting rooms based on selected location
  const filteredMeetingRooms = selectedLocation
    ? allMeetingRooms.filter((room) => room.location.name === selectedLocation)
    : [];

  const onSubmit = (data) => {
console.log(data);
    navigate(
      `/app/meetings/schedule-meeting?location=${data.unit}&meetingRoom=${data.meetingRoom}`,
    );
  };

  return (
    <div className="border-default border-borderGray m-4 p-4 rounded-md text-center">
      <h2 className="font-pregular text-title text-primary mt-20 mb-10">
        Book A Meeting
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="grid grid-cols-1 px-0 sm:grid-cols-1 md:grid-cols-2 md:px-0 sm:px-0 justify-center gap-4 mb-10 w-full">
          {/* Location Dropdown */}
          <Controller
            name="unit"
            control={control}
            rules={{ required: "Please select a Unit" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Select Unit"
                fullWidth
                select
                size="small"
                error={!!errors.unit}
                helperText={errors.unit?.message}
              >
                <MenuItem value="" disabled>
                  {" "}
                  Seletc Unit
                </MenuItem>
                <MenuItem value="Unit">Unit</MenuItem>
              </TextField>
            )}
          />
          <Controller
            name="meetingRoom"
            control={control}
            rules={{ required: "Select a Meeting Room" }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Select Meeting Room"
                fullWidth
                size="small"
                select
                disabled={!watchFields.unit}
                error={!!errors.meetingRoom}
                helperText={errors.meetingRoom?.message}
              >
                <MenuItem value="" disabled>
                  {" "}
                  Seletc Unit
                </MenuItem>
                <MenuItem value="Unit">Unit</MenuItem>
              </TextField>
            )}
          />
        </div>
        <div className="flex w-full justify-center items-center">
          <PrimaryButton title="Next" type="submit" externalStyles={"w-40"} />
        </div>
      </form>
    </div>
  );
};

export default BookMeetings;
