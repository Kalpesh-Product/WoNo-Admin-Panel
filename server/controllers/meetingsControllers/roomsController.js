const Room = require("../../models/Rooms");
const idGenerator = require("../../utils/idGenerator");
const sharp = require("sharp");
const {
  handleFileUpload,
  handleFileDelete,
} = require("../../config/cloudinaryConfig");
const { default: mongoose } = require("mongoose");

const addRoom = async (req, res, next) => {
  try {
    const { name, seats, description } = req.body;

    if (!name || !seats || !description) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const roomId = idGenerator("R");

    let imageId;
    let imageUrl;

    if (req.file) {
      const file = req.file;

      const buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;
      const uploadResult = await handleFileUpload(base64Image, "rooms");

      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    const room = new Room({
      roomId,
      name,
      seats,
      description,
      assignedAssets: [],
      image: {
        id: imageId,
        url: imageUrl,
      },
    });

    const savedRoom = await room.save();

    res.status(201).json({
      message: "Room added successfully",
      room: savedRoom,
    });
  } catch (error) {
    console.error("Error adding room:", error);
    next(error);
  }
};

const getRooms = async (req, res, next) => {
  try {
    // Fetch all rooms, including the assigned assets data
    const rooms = await Room.find().populate("assignedAssets");

    // Send the response with the fetched rooms
    res.status(200).json({
      success: true,
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const { id: roomId } = req.params;
    const { name, description, seats } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID must be provided." });
    }

    // Validate the Room ID
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Invalid Room ID." });
    }

    // Find the room to update
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    let imageId = room.image?.id;
    let imageUrl = room.image?.url;

    // Check if a new file is provided
    if (req.file) {
      const file = req.file;

      // Process the image using Sharp
      const buffer = await sharp(file.buffer)
        .resize(800, 800, { fit: "cover" })
        .webp({ quality: 80 })
        .toBuffer();

      const base64Image = `data:image/webp;base64,${buffer.toString("base64")}`;

      // Delete the current image in Cloudinary if it exists
      if (imageId) {
        await handleFileDelete(imageId);
      }

      // Upload the new image to Cloudinary
      const uploadResult = await handleFileUpload(base64Image, "rooms");
      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    // Update the room details only if they are provided
    if (name) room.name = name;
    if (description) room.description = description;
    if (seats) room.seats = seats;
    if (req.file) room.image = { id: imageId, url: imageUrl };

    const updatedRoom = await room.save();

    res.status(200).json({
      message: "Room updated successfully.",
      room: updatedRoom,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addRoom, getRooms, updateRoom };
