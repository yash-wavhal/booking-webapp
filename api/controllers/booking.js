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

// export async function getBookedHotel(req, res, next) {
//     try {
//         const bookings = await Book.find({ hotelId: req.params.hotelId })
//             .populate("hotelId hotelOwnerId userId")
//             .populate("roomDetails.roomId");
//         res.status(200).json(bookings);
//     } catch (err) {
//         next(err);
//     }
// }

export async function cancelBooking(req, res, next) {
    try {
        await Book.findByIdAndDelete(req.params.bookingId);
        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (err) {
        next(err);
    }
}
