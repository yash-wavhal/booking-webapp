import express from "express";
import { cancelBooking, createBooking, getBookingsByUser, upcomingBookings } from "../controllers/booking.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// :id is userId
router.post("/:id", verifyUser, createBooking);
router.get("/user/:id", verifyUser, getBookingsByUser);
router.get("/upcoming/:id", verifyUser, upcomingBookings);
router.delete("/cancel/:bookingId/:id", verifyUser, cancelBooking);

export default router;