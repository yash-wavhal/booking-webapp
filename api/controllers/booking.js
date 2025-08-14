import Book from "../models/Book.js";

export async function createBooking(req, res, next) {
    try {
        const newBooking = new Book(req.body);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (err) {
        next(err);
    }
}

export async function getBookingsByUser(req, res, next) {
    try {
        const bookings = await Book.find({ userId: req.params.id })
            .populate("hotelId hotelOwnerId userId")
            .populate("roomId");
        res.status(200).json(bookings);
    } catch (err) {
        next(err);
    }
}

export const getBooking = async (req, res, next) => {
  try {
    const booking = await Book.findById(req.params.id)
      .populate("hotelId")
      .populate("hotelOwnerId")
      .populate("userId")
      .populate("roomId")
      .exec();

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (err) {
    next(err);
  }
}

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Book.find()
      .populate("hotelId")
      .populate("hotelOwnerId")
      .populate("userId")
      .populate("roomId")
      .exec();

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Server error fetching bookings" });
  }
}

export async function upcomingBookings(req, res, next) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookings = await Book.find({
      userId: req.params.id,
      checkInDate: { $gte: today },
    })
      .populate("hotelId hotelOwnerId userId")
      .populate("roomId")
      .sort({ checkInDate: 1 });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function cancelBooking(req, res, next) {
  try {
      await Book.findByIdAndDelete(req.params.bookingId);
      res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
      next(err);
  }
}

export async function cancelBookingByNumber(req, res, next) {
  const { bookingId } = req.params;
  const { number } = req.body;

  if (!number && number !== 0) {
    return res.status(400).json({ error: "Room number is required" });
  }

  try {
    const booking = await Book.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const updatedRoomDetails = booking.roomDetails.filter(
      (room) => room.number !== Number(number)
    );

    booking.roomDetails = updatedRoomDetails;
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    next(err);
  }
}