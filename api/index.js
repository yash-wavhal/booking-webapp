import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";
import uploadRoute from "./routes/upload.js";
import cookieParser from "cookie-parser";
import bookingRoute from "./routes/bookings.js"

const app = express();
dotenv.config();
// console.log("Mongo URI:", process.env.MONGO);
main().then((res) => {
    console.log("Connection successful");
    // console.log(res);
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO);
}

mongoose.connection.on("disconnected", () => {
    console.log("Mongodb disconnected!");
});

mongoose.connection.on("connected", () => {
    console.log("Mongodb connected!");
});

// middlewares
app.use(cors({
    origin: ["http://localhost:3000", process.env.FRONTEND],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());        // used so that it can access the json data

app.use("/api/auth", authRoute);  // when we use /auth in url then it will go to the get request at "/" in the auth.js file
// when we use /auth/rgister in url then it will go to the get request at "/register" in the auth.js file
// it means consider /auth as a "/" in auth.js
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/users", usersRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/bookings", bookingRoute);

app.use((err, req, res, next) => {        // This middleware is used to send error. See next in hotels.js how it is used
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});