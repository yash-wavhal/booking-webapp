import express from "express";
import { deleteUser, getSavedHotels, getUser, getUsers, saveHotel, unsaveHotel, updateUser } from "../controllers/user.js";
import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// UPDATE
router.put("/:id", verifyUser, updateUser);

// DELETE
router.delete("/:id", verifyAdmin, deleteUser);

// GET
router.get("/:id", verifyAdmin, getUser);

// GETALL
router.get("/", verifyAdmin, getUsers);

router.post("/save-hotel/:id/:hotelId", verifyUser, saveHotel);

router.post("/unsave-hotel/:id/:hotelId", verifyUser, unsaveHotel);

router.get("/saved-hotels/:id", verifyUser, getSavedHotels);

export default router;