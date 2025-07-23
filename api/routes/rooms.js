import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  getRoomsByHotel
} from "../controllers/room.js";
import {
  verifyUser,
  verifyHotelOwner,
} from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:hotelid/:id", verifyUser, verifyHotelOwner, createRoom);

// UPDATE
router.put("/:id/:hotelid/:roomid", verifyUser, verifyHotelOwner, updateRoom);

// DELETE
router.delete("/:id/:roomid/:hotelid", verifyUser, verifyHotelOwner, deleteRoom);

// GET
router.get("/:id", getRoom);

router.get("/byhotel/:id", getRoomsByHotel);

// GET ALL
router.get("/", getRooms);

export default router;
