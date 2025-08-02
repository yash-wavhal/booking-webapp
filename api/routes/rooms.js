import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  getRoomsByHotel,
  updateRoomAvailability
} from "../controllers/room.js";
import {
  verifyUser,
  verifyHotelOwner,
} from "../utils/verifyToken.js";

const router = express.Router();

router.put("/available/:roomId/:number", updateRoomAvailability);

// CREATE
router.post("/:hotelid/:id", verifyUser, verifyHotelOwner, createRoom);

// UPDATE
router.put("/:id/:hotelid/:roomid", verifyUser, verifyHotelOwner, updateRoom);

// DELETE
router.delete("/:id/:roomid/:hotelid", verifyUser, verifyHotelOwner, deleteRoom);
// router.put("/available/:roomId/:number", updateRoomAvailability);  //from here

// GET
router.get("/:id", getRoom);

router.get("/byhotel/:id", getRoomsByHotel);

// GET ALL
router.get("/", getRooms);

export default router;
