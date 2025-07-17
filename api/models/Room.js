import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 1,
        },
        maxPeople: {
            type: Number,
            required: true,
            min: 1,
        },
        desc: {
            type: String,
            required: true,
        },
        roomNumbers: [
            {
                number: { type: Number, required: true },
                unavailableDates: { type: [Date], default: [] },
            },
        ],
        hotelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Hotel",
            required: true,
        },

        photos: {
            type: [String],
            required: false,
        },
        extraGuestCharge: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxExtraGuests: {
            type: Number,
            default: 0,
            min: 0,
        },
        extraBedCharge: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxExtraBeds: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
