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
        },
        maxPeople: {
            type: Number,
            required: true,
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
    },
    { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
