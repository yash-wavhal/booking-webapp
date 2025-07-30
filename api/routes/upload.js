import express from "express";
import multer from "multer";
import { uploadMultipleImages, uploadSingleImage } from "../controllers/uploadController.js";

const router = express.Router();
const upload = multer({
  dest: "temp/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 10                  // max 10 files
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);  // ✅ Accept
    } else {
      cb(new Error("Only image files are allowed!"), false);  // ❌ Reject
    }
  },
});

router.post("/images", upload.array("images", 10), uploadMultipleImages);
router.post("/image", upload.single("image"), uploadSingleImage);

export default router;