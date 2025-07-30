import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const uploadMultipleImages = async (req, res, next) => {
  try {
    const urls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "hotel_images",
      });
      fs.unlinkSync(file.path);
      urls.push(result.secure_url);
    }

    res.status(200).json({ imageUrls: urls });
  } catch (err) {
    next(err);
  }
};

export const uploadSingleImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures",
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    next(err);
  }
};