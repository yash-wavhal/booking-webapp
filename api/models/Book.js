import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
    },
    hotelOwnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    roomDetails: [
        {
            roomId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
                required: true
            },
            roomNumbers: [
                {
                    number: { type: Number, required: true },
                    _id: false
                },
            ],
            noOfExtraGuests: {
                type: Number,
                default: 0,
                min: 0,
            },
            noOfExtraBeds: {
                type: Number,
                default: 0,
                min: 0,
            },
        },
    ],
    checkInDate: {
        type: Date,
        required: true,
    },
    checkOutDate: {
        type: Date,
        required: true,
    }
}, { timestamps: true });

export default mongoose.model("Booking", BookSchema);