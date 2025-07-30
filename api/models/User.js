import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phoneNumber: {
            type: String,
        },
        pfp: {
            type: String,
        },

        personalDetails: {
            dob: { type: Date },
            gender: { type: String, enum: ["male", "female", "other"] },
            nationality: { type: String },
        },

        address: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            pinCode: { type: String },
        },

        password: {
            type: String,
            required: true,
        },

        savedHotels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hotel",
            },
        ],

        isAdmin: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", UserSchema);