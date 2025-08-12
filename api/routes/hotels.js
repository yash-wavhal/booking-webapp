import express from "express";
import { countAllCities, countByCity, countByType, createHotel, deleteHotel, getHotel, getHotels, getHotelsByCityName, getHotelsByHotelType, getHotelsOfUser, getMostBookedHotels, searchHotels, updateHotel } from "../controllers/hotel.js";
import { verifyAdmin, verifyHotelOwner, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE (user can create their own hotel listing)
router.post("/create/:id", verifyUser, createHotel);

// UPDATE (user can only update their own hotel)
router.put("/:id/:hotelid", verifyUser, verifyHotelOwner, updateHotel);

router.delete("/admin/:hotelid", verifyAdmin, deleteHotel);

// DELETE (user can only delete their own hotel)
router.delete("/:hotelid", verifyUser, verifyHotelOwner, deleteHotel);

router.get("/mostbooked", getMostBookedHotels);

router.get("/countByType", countByType);

router.get("/type/:hotelType", getHotelsByHotelType);

// GET hotel
router.get("/find/:id", getHotel);
router.get("/search", searchHotels);

// GET all hotels
router.get("/:id", getHotels);
router.get("/user/:id", getHotelsOfUser);

router.get("/hotelsbycityname/:city", getHotelsByCityName);

// GET counts
router.get("/getallcitiescount", countAllCities);
router.get("/countByCity", countByCity);

export default router;