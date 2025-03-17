import React, { useEffect, useState } from "react";
import {
  MenuItem,
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
      location: "",
      meetingRoom: "",
    },
  });

  const watchFields = watch();
  const selectedUnit = useWatch({ control, name: "location" });
  const [selectedUnitId, setSelectedUnitId] = useState("");


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
    ? allMeetingRooms.filter((room) => room.location?.building?._id === selectedUnitId)
    : [];

  useEffect(() => {
    setValue("meetingRoom", ""); // Reset meeting room selection
  }, [selectedUnit, setValue]);

  useEffect(() => {
  }, [filteredMeetingRooms]);

  const onSubmit = (data) => {

    const selectedLocation = allMeetingRooms.find((location)=>location.location?.building?._id === data.location)
    const selectedRoom = allMeetingRooms.find((room)=>room._id === data.meetingRoom)

    const selectedLocationName = selectedLocation.location?.building?.buildingName
    const selectedRoomName = selectedRoom.name
    const selectedLocationId = selectedLocation.location?.building?._id
    const selectedRoomId = selectedRoom._id

    console.log(data);
    navigate(
      `/app/meetings/schedule-meeting?location=${encodeURIComponent(selectedLocationName)}&meetingRoom=${encodeURIComponent(selectedRoomName)}`
    );
  };

  return (
    <div className="border-default border-borderGray m-4 p-4 rounded-md text-center">
      <h2 className="font-pregular text-title text-primary my-10">
        Book A Meeting
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div className="grid grid-cols-1 px-0 sm:grid-cols-1 md:grid-cols-2 md:px-0 sm:px-0 justify-center gap-4 mb-10 w-full">
          {/* Location Dropdown */}
          <Controller
            name="location"
            control={control}
            rules={{ required: "Please select a Location" }}
            render={({ field }) => {
              const uniqueBuildings = [
                ...new Map(
                  allMeetingRooms.map((room)=>[
                    room.location?.building?._id,
                    room.location?.building
                  ])
                ).values()
              ]
              return (
              <TextField
                {...field}
                label="Select Location"
                fullWidth
                select
                size="small"
                error={!!errors.location}
                helperText={errors.location?.message}
                onChange={(e) => {
                  const locationId = e.target.value;
                  field.onChange(e.target.value);

                  const selectedLocation = uniqueBuildings.find(
                    (building) => building?._id === locationId
                  );
                  setSelectedUnitId(selectedLocation?._id  || "");
                }}
              >
                <MenuItem value="" disabled>
                  {" "}
                  Seletc Location
                </MenuItem>
                {uniqueBuildings.map((building) => (
                  <MenuItem key={building?._id} value={building?._id}>
                    {building?.buildingName}
                  </MenuItem>
                ))}
              </TextField>
            )}}
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
                disabled={!watchFields.location}
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
