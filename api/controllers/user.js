import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);    // Saves the newly created hotel document in the MongoDB database.
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const saveHotel = async (req, res) => {
  try {
    const { id, hotelId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedHotels.includes(hotelId)) {
      user.savedHotels.push(hotelId);
      await user.save();
    }

    res.status(200).json({ message: "Hotel saved", savedHotels: user.savedHotels });
  } catch (err) {
    res.status(500).json({ message: "Error saving hotel", error: err.message });
  }
};

export const unsaveHotel = async (req, res) => {
  try {
    const { id, hotelId } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.savedHotels.includes(hotelId)) {
      user.savedHotels = user.savedHotels.filter(
        (hId) => hId.toString() !== hotelId
      );
      await user.save();
    }

    await user.populate("savedHotels");

    res.status(200).json({ message: "Hotel unsaved", savedHotels: user.savedHotels });
  } catch (err) {
    res.status(500).json({ message: "Error unsaving hotel", error: err.message });
  }
};

export const getSavedHotels = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("savedHotels");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.savedHotels);
  } catch (err) {
    res.status(500).json({ message: "Error fetching saved hotels", error: err.message });
  }
};