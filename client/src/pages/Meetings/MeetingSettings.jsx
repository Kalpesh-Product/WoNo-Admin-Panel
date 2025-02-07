import React, { useState } from "react";
import PrimaryButton from "../../components/PrimaryButton";
import { Button, Card, CardContent, CardMedia, TextField } from "@mui/material";
import { FiMonitor, FiSun, FiWifi } from "react-icons/fi";
import MuiModal from "../../components/MuiModal";
import { Controller, useForm } from "react-hook-form";

const MeetingSettings = () => {
  const [openModal, setOpenModal] = useState(false);
  const { control, reset, handleSubmit } = useForm();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    field.onChange(file); // Update React Hook Form state
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const meetingRooms = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/dua5bpiab/image/upload/v1734008504/rooms/zi23kzrxwlqctol71pwk.jpg",
      roomName: "Baga",
      roomStatus: "Available",
      seats: "4",
    },
    {
      id: 2,
      image:
        "https://res.cloudinary.com/dua5bpiab/image/upload/v1734008594/rooms/ruzzlcslwdlugk5ysbj5.jpg",
      roomName: "Arambol",
      roomStatus: "Available",
      seats: "8",
    },
    {
      id: 3,
      image:
        "https://res.cloudinary.com/dua5bpiab/image/upload/v1734008698/rooms/fttb1l4ct1kpscmwwj1p.jpg",
      roomName: "San Francisco",
      roomStatus: "Available",
      seats: "7",
    },
    {
      id: 4,
      image:
        "https://res.cloudinary.com/dua5bpiab/image/upload/v1734008746/rooms/slpn2cqpfzge6kspsunq.jpg",
      roomName: "Zurich",
      roomStatus: "Available",
      seats: "8",
    },
    {
      id: 5,
      image:
        "https://res.cloudinary.com/dua5bpiab/image/upload/v1734008890/rooms/kv9vq7emnwnsetbu9yip.jpg",
      roomName: "Madrid",
      roomStatus: "Available",
      seats: "6",
    },
    {
      id: 6,
      image:
        "https://res.cloudinary.com/dua5bpiab/image/upload/v1734008979/rooms/i74kxlrdgsztlpb2rgnp.jpg",
      roomName: "Vatican",
      roomStatus: "Available",
      seats: "14",
    },
  ];
  return (
    <div className="m-4 rounded-md border-default border-borderGray">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-title text-primary">Meeting Rooms</span>
          </div>
          <div>
            <PrimaryButton
              handleSubmit={handleOpenModal}
              title={"Add New Room"}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {meetingRooms.map((room) => (
            <>
              <Card
                key={room.id}
                className="shadow-md hover:shadow-lg transition-shadow border border-gray-200"
              >
                <CardMedia
                  component="img"
                  sx={{ height: "350px" }}
                  image={room.image}
                  alt={room.roomName}
                  className="object-contain"
                />
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-subtitle">{room.roomName}</span>
                    <span
                      className={`px-4 py-1 text-content font-pregular rounded-full ${
                        room.roomStatus === "Available"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {room.roomStatus}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mb-4 text-gray-500">
                    <FiWifi />
                    <FiSun />
                    <FiMonitor />
                  </div>
                  <p className="mb-2 text-sm font-medium text-gray-800">
                    <span role="img" aria-label="person">
                      👥
                    </span>{" "}
                    Fits {room.seats} people
                  </p>
                  <div className="mt-4">
                    <PrimaryButton title={"Edit Room"} />
                  </div>
                </CardContent>
              </Card>
            </>
          ))}
        </div>
      </div>

      <MuiModal
        open={openModal}
        onClose={handleCloseModal}
        title={"Add a Meeting Room"}
      >
        <div className="flex flex-col gap-4">
          <form
            onSubmit={handleSubmit(() => {
              ("form submitted");
              setOpenModal(false);
            })}
          >
            <div className="flex flex-col gap-4">
              <Controller
                name="roomName"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={"Room Name"}
                    variant={"outlined"}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="seats"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={"Seats"}
                    variant={"outlined"}
                    size="small"
                    fullWidth
                  />
                )}
              />
              <Controller
                name="description"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={"Description"}
                    variant={"outlined"}
                    multiline
                    rows={5}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="roomImage"
                control={control}
                defaultValue={null}
                render={({ field }) => (
                  <div className="flex flex-col gap-2">
                    <span className="text-content">Upload Room Image</span>
                    <div className="flex gap-2 items-center">
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-file"
                        onChange={(event) => handleFileChange(event, field)}
                      />
                      <label htmlFor="upload-file">
                        <Button sx={{backgroundColor:'#ebf5ff', color:'#4b5d87', fontFamily:'Poppins-Bold'}} variant="contained" component="span">
                          Choose File
                        </Button>
                      </label>
                      <span className="text-content">
                        {selectedFile ? selectedFile.name : "No file chosen"}
                      </span>
                    </div>
                  </div>
                )}
              />

              <div className="flex justify-center">
                <PrimaryButton title={"Submit"} type={"submit"} />
              </div>
            </div>
          </form>
        </div>
      </MuiModal>
    </div>
  );
};

export default MeetingSettings;
