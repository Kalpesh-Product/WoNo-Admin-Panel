const Room = require("../../models/meetings/Rooms");
const idGenerator = require("../../utils/idGenerator");
const User = require("../../models/UserData");
const sharp = require("sharp");
const mongoose = require("mongoose");
const { handleFileUpload } = require("../../config/cloudinaryConfig");
const { createLog } = require("../../utils/moduleLogs");

const addRoom = async (req, res, next) => {
  const { user, ip,company } = req;
  const path = "RoomLogs";
  const action = "Add Room";

  try {
    const { name, seats, description, location } = req.body;

    if (!name || !seats || !description || !location) {
      await createLog(path, action, "All required fields must be provided", "Failed", user, ip);
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Find the user and populate the company
    const foundUser = await User.findById(user)
      .select("company")
      .populate({
        path: "company",
        select: "companyName workLocations",
      })
      .lean()
      .exec();

    if (!foundUser || !foundUser.company) {
      await createLog(path, action, "Unauthorized or company not found", "Failed", user, ip);
      return res.status(400).json({ message: "Unauthorized or company not found" });
    }

    // Check if the provided location exists in the company's workLocations
    const isValidLocation = company.workLocations.some((loc) => loc.name === location);

    if (!isValidLocation) {
      await createLog(path, action, "Invalid location", "Failed", user, ip, company);
      return res.status(400).json({
        message: "Invalid location. Must be a valid company work location.",
      });
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
      const uploadResult = await handleFileUpload(
        base64Image,
        `${foundUser.company.companyName}/rooms`
      );

      imageId = uploadResult.public_id;
      imageUrl = uploadResult.secure_url;
    }

    const room = new Room({
      roomId,
      name,
      seats,
      description,
      location, // Store validated location
      assignedAssets: [],
      company: company._id, // Store company reference
      image: {
        id: imageId,
        url: imageUrl,
      },
    });

    const savedRoom = await room.save();

    await createLog(path, action, "Room added successfully", "Success", user, ip, company, savedRoom._id,{
      roomId,
      name,
      seats,
      description,
      location,
    });

    res.status(201).json({
      message: "Room added successfully",
      room: savedRoom,
    });
  } catch (error) {
     await createLog(path, action, "Error adding room", "Failed", user, ip, { error: error.message });
    next(error);
  }
};


const getRooms = async (req, res, next) => {
  try {
    // Fetch all rooms, including the assigned assets data
    const rooms = await Room.find().populate("assignedAssets");

    // Send the response with the fetched rooms
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};

const updateRoom = async (req, res, next) => {
  const { user, ip, company } = req;
  const path = "RoomLogs";
  const action = "Update Room";

  try {
    const { id: roomId } = req.params;
    const { name, description, seats } = req.body;

    if (!roomId) {
      await createLog(path, action, "Room ID must be provided", "Failed", user, ip,company);
      return res.status(400).json({ message: "Room ID must be provided." });
    }

    // Validate the Room ID
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      await createLog(path, action, "Invalid Room ID", "Failed", user, ip,company);
      return res.status(400).json({ message: "Invalid Room ID." });
    }

    // Find the room to updatecompany,
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      await createLog(path, action, "Room not found", "Failed", user, ip,company);
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

    const updatedFields = {};
    if (name && name !== room.name) updatedFields.name = name;
    if (description && description !== room.description) updatedFields.description = description;
    if (seats && seats !== room.seats) updatedFields.seats = seats;
    if (req.file) updatedFields.image = { id: imageId, url: imageUrl };

    // Update the room details only if they are provided
    Object.assign(room, updatedFields);

    const updatedRoom = await room.save();

    await createLog(path, action, "Room updated successfully", "Success","Success", user, ip,company,updatedRoom._id,
      updatedFields);

    res.status(200).json({
      message: "Room updated successfully.",
      room: updatedRoom,
    });
  } catch (error) {
    await createLog(path, action, "Error updating room", "Failed", user, ip,company,id=null, { error: error.message });
    next(error);
  }
};

module.exports = { addRoom, getRooms, updateRoom };
