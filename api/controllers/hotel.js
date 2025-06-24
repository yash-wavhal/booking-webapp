import Hotel from "../models/Hotel.js";

export const createHotel = async (req, res, next) => {
    const newHotel = new Hotel({
        ...req.body,
        ownerId: req.user.id,
    });
    try {
        const savedHotel = await newHotel.save();
        res.status(201).json(savedHotel);
    } catch (err) {
        next(err);
    }
};

export const updateHotel = async (req, res, next) => {
    try {
        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!updatedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(updatedHotel);
    } catch (err) {
        next(err);
    }
};

export const deleteHotel = async (req, res, next) => {
    try {
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.id);
        if (!deletedHotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json({ message: "Hotel has been deleted." });
    } catch (err) {
        next(err);
    }
};

export const getHotel = async (req, res, next) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        res.status(200).json(hotel);
    } catch (err) {
        next(err);
    }
};

export const getHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

export const getMostBookedHotels = async (req, res, next) => {
    try {
        const hotels = await Hotel.find()
            .sort({bookingsCount: -1})
            .limit(10)
            .select("name city adderss distance photos title desc rating bookingsCount cheapestPrice")

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

export const getHotelsOfUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const hotels = await Hotel.find({ ownerId: userId });
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

export const countByCity = async (req, res, next) => {
    const cities = req.query.cities?.split(",");
    if (!cities) {
        return res.status(400).json({ message: "Please provide cities query parameter." });
    }
    try {
        const list = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city }); 
        }));

        res.status(200).json(list);
    } catch (err) {
        next(err);
    }
};

export const countAllCities = async (req, res, next) => {
  try {
    const results = await Hotel.aggregate([
        {
            $group: {
                _id: "$city",
                count: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                city: "$_id",
                count: 1
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    res.status(200).json(results);
  } catch (err) {
    next(err);
  }
};

export const countByType = async (req, res, next) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: "hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
        const resortCount = await Hotel.countDocuments({ type: "resort" });
        const villaCount = await Hotel.countDocuments({ type: "villa" });
        const cabinCount = await Hotel.countDocuments({ type: "cabin" });
        res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartment", count: apartmentCount },
            { type: "resort", count: resortCount },
            { type: "villa", count: villaCount },
            { type: "cabin", count: cabinCount },
        ]);
    } catch (err) {
        next(err);
    }
};