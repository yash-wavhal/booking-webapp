import Hotel from "../models/Hotel.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel(req.body);    // Creates a new instance of the Hotel model using the data received.
    try {
        const savedHotel = await newHotel.save();    // Saves the newly created hotel document in the MongoDB database.
        res.status(200).json(savedHotel);
    } catch(err) {
        next(err);
    }
};

export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        res.status(200).json(updatedHotel);
    } catch(err) {
        next(err);
    }
};

export const deleteHotel = async (req, res, next) => {
    try {
        await Hotel.findByIdAndDelete(req.params.id);    // Saves the newly created hotel document in the MongoDB database.
        res.status(200).json("Hotel has been deleted.");
    } catch(err) {
        next(err);
    }
};

export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        res.status(200).json(hotel);
    } catch(err) {
        next(err);
    }
};

export const getHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch(err) {
        next(err);
    }
};

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({city: city});    // It will count how many times each city is 
        }))
        res.status(200).json(list);
    } catch(err) {
        next(err);
    }
};