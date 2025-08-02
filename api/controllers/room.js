import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });
    res.status(201).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.roomid,
      { $set: req.body },
      { new: true }
    );
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    const result = await Room.updateOne(
      {
        _id: req.params.roomId,
        "roomNumbers.number": Number(req.params.number),
      },
      {
        $push: {
          "roomNumbers.$.unavailableDates": { $each: req.body.dates },
        },
      }
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  const roomId = req.params.roomid;
  const hotelId = req.params.hotelid;

  try {
    await Room.findByIdAndDelete(roomId);
    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: roomId },
    });
    res.status(200).json({ message: "Room has been deleted." });
  } catch (err) {
    next(err);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotelId");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

export const getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.id }); 
    // console.log(rooms);
    res.json(rooms); 
  } catch(err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};
