import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req, res, next) => {
    try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash,
        });
        await newUser.save();
        res.status(200).send("User has been created successfully!");
    } catch(err) {
        next(err);
    }
};
// console.log("process.env.JWT", process.env.JWT_SECRET);   //undefined

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user) {
            return next(createError(404, "User not found!"));
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect) {
            return next(createError(400, "password is not correct!"));
        }
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin},
            process.env.JWT_SECRET
        );
        const {password, isAdmin, ...otherDetails} = user._doc;    // purpose is we dont wnat to send the password ans isAdmin in response so we sent ...otherDetails(that is details other than password and isAdmin)
        res.cookie("access_token", token, {
            httpOnly: true,
        }).status(200).json({...otherDetails});
    } catch(err) {
        next(err);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie("access_token"); 
        res.status(200).json({ message: "Logged out successfully" });
    } catch(err) {
        next(err);
    }
};