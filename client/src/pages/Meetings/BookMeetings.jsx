import React, { useState } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MuiModal from "../../components/MuiModal";
import PrimaryButton from "../../components/PrimaryButton";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const BookMeetings = () => {
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      location: "",
      meetingRoom: "",
    },
  });

  const onSubmit = (data) => {
    const { location, meetingRoom } = data;

    // Ensure both fields are selected
    if (!location || !meetingRoom) {
      alert("Please select both location and meeting room.");
      return;
    }

    // Navigate to second page with query parameters
    navigate(`/app/meetings/schedule-meeting?location=${location}&meetingRoom=${meetingRoom}`);
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
        <div className="flex justify-center gap-4 mb-10 px-20 w-full">
          <FormControl className="w-1/2">
            <InputLabel>Select Location</InputLabel>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Select Location">
                  <MenuItem value="">Select Location</MenuItem>
                  <MenuItem value={'ST-701'}>ST-701</MenuItem>
                  <MenuItem value={'Location 2'}>Location 2</MenuItem>
                </Select>
              )}
            />
          </FormControl>

          <FormControl className="w-1/2">
            <InputLabel>Select Meeting Room</InputLabel>
            <Controller
              name="meetingRoom"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Select Meeting Room">
                  <MenuItem value="">Select Meeting Room</MenuItem>
                  <MenuItem value={'Baga'}>Baga</MenuItem>
                  <MenuItem value={'Room 2'}>Room 2</MenuItem>
                </Select>
              )}
            />
          </FormControl>
        </div>

        <PrimaryButton
          title="Next"
          type="submit"
          fontSize="text-content"
          externalStyles="w-48 mb-20"
        />
      </form>
    </div>
  );
};

export default BookMeetings;
