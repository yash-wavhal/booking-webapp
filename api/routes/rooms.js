import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
} from "../controllers/room.js";
import {
  verifyUser,
  verifyHotelOwner,
} from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:hotelid", verifyUser, verifyHotelOwner, createRoom);

// UPDATE
router.put("/:id", verifyUser, verifyHotelOwner, updateRoom);

// DELETE
router.delete("/:id/:hotelid", verifyUser, verifyHotelOwner, deleteRoom);

// GET
router.get("/:id", getRoom);

// GET ALL
router.get("/", getRooms);

export default router;
