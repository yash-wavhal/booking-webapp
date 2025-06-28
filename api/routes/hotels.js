import express from "express";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";
import { countAllCities, countByCity, countByType, createHotel, deleteHotel, getHotel, getHotels, getHotelsByCityName, getHotelsByHotelType, getHotelsOfUser, getMostBookedHotels, updateHotel } from "../controllers/hotel.js";
import { verifyHotelOwner, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE (user can create their own hotel listing)
router.post("/", verifyUser, createHotel);

// UPDATE (user can only update their own hotel)
router.put("/:id", verifyUser, verifyHotelOwner, updateHotel);

// DELETE (user can only delete their own hotel)
router.delete("/:id", verifyUser, verifyHotelOwner, deleteHotel);

// GET hotel
router.get("/find/:id", getHotel);

// GET all hotels
router.get("/", getHotels);
router.get("/user/:id", getHotelsOfUser);

router.get("/mostbooked", getMostBookedHotels);
router.get("/hotelsbycityname/:city", getHotelsByCityName);

router.get("/type/:hotelType", getHotelsByHotelType);

// GET counts
router.get("/getallcitiescount", countAllCities);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);


export default router;