import express from "express";
import { cancelBooking, createBooking, getAllBookings, getBooking, getBookingsByUser, upcomingBookings } from "../controllers/booking.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";
import Book from "../models/Book.js";

const router = express.Router();

// :id is userId
router.post("/:id", verifyUser, createBooking);
router.get("/user/:id", verifyUser, getBookingsByUser);
router.get("/upcoming/:id", verifyUser, upcomingBookings);
router.get("/:id", verifyAdmin, getBooking);
router.get("/", verifyAdmin, getAllBookings);
router.delete("/cancel/:bookingId/:id", verifyUser, cancelBooking);

export default router;