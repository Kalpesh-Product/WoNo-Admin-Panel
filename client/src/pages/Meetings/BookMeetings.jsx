import React, { useEffect, useRef, useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  TextField,
} from "@mui/material";
import PrimaryButton from "../../components/PrimaryButton";
import { Controller, useForm, useWatch } from "react-hook-form";
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
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      unit: "",
      meetingRoom: "",
    },
  });

  const watchFields = watch();
  const selectedUnit = useWatch({ control, name: "unit" });
  const [selectedUnitId, setSelectedUnitId] = useState("");

  const selectedLocation = watch("location");

  // Fetch Work Locations
  const {
    data: units = [],
    isLoading: locationsLoading,
    error: locationsError,
  } = useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/company/fetch-units");
        return response.data;
      } catch (error) {
        console.log(error.message);
      }
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
      return response.data;
    },
  });

  // Filter meeting rooms based on selected location
  const filteredMeetingRooms = selectedUnitId
    ? allMeetingRooms.filter((room) => room.location?.unitNo === selectedUnitId)
    : [];

  useEffect(() => {
    setValue("meetingRoom", ""); // Reset meeting room selection
  }, [selectedUnit, setValue]);

  useEffect(() => {
    console.log(filteredMeetingRooms);
  }, [filteredMeetingRooms]);

  const onSubmit = (data) => {
    console.log(data);
    navigate(
      `/app/meetings/schedule-meeting?location=${data.unit}&meetingRoom=${data.meetingRoom}`
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
                onChange={(e) => {
                  const unitId = e.target.value;
                  field.onChange(e.target.value);

                  const selectedUnit = units.find(
                    (unit) => unit._id === unitId
                  );
                  setSelectedUnitId(selectedUnit?.unitNo || "");
                }}
              >
                <MenuItem value="" disabled>
                  {" "}
                  Seletc Unit
                </MenuItem>
                {units.map((location, index) => (
                  <MenuItem key={index} value={location._id}>
                    {location.unitNo}
                  </MenuItem>
                ))}
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
                  Seletc Room
                </MenuItem>
                {filteredMeetingRooms.map((room, index) => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.name}
                  </MenuItem>
                ))}
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
