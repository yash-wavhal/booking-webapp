import jwt from "jsonwebtoken";
import { createError } from "./error.js";
import Hotel from "../models/Hotel.js";

// Verify the token and set req.user
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is invalid!"));
    req.user = user;
    next();
  });
};

// Verify the user matches the requested id or is admin
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

// Verify admin only
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyHotelOwner = async (req, res, next) => {
  try {
    // console.log("verifyHotelOwner", req.params.hotelid);
    const hotel = await Hotel.findById(req.params.hotelid);
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });
    if(hotel.ownerId.toString() === req.user.id || req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Not authorized to modify this hotel" });
    }
  } catch (err) {
    next(err);
  }
};
