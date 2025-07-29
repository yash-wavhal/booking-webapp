import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
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
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    roomDetails: [
      {
        roomNumbers: [
          {
            number: { type: Number, required: true },
            noOfExtraGuests: { type: Number, default: 0, min: 0 },
            noOfExtraBeds: { type: Number, default: 0, min: 0 },
          },
        ],
        people: {
          adult: { type: Number, default: 1, min: 1 },
          children: { type: Number, default: 0, min: 0 },
        },
      },
    ],
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookSchema);