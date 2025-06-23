import express from "express";
import { login, logout, register } from "../controllers/auth.js";
import { verifyToken } from "../utils/verifyToken.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", verifyToken, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password"); 
  res.status(200).json({ user }); 
});

export default router;