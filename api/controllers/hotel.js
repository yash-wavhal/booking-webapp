import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

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
            req.params.hotelid,
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
        const deletedHotel = await Hotel.findByIdAndDelete(req.params.hotelid);
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

export const searchHotels = async (req, res, next) => {
    try {
        const { destination, startDate, endDate, adult, children, room } = req.query;
        const hotels = await Hotel.find({ city: new RegExp(`^${destination}$`, "i") });
        const start = new Date(startDate);
        const end = new Date(endDate);
        const totalPeoples = Number(adult) + Number(children);
        const availableHotels = [];
        for (const hotel of hotels) {
            const rooms = await Room.find({
                hotelId: hotel._id,
                maxPeople: { $gte: totalPeoples },
                roomNumbers: {
                    $not: {
                        $elemMatch: {
                            unavailableDates: {
                                $elemMatch: {
                                    $gte: start,
                                    $lte: end,
                                },
                            },
                        },
                    },
                },
            });
            if (rooms.length > 0) {
                availableHotels.push(hotel);
            }
        }
        res.status(200).json(availableHotels);
    } catch (err) {
        next(err);
    }
}

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
            .sort({ bookingsCount: -1 })
            .limit(10)
            .select("name city address distance photos title desc rating bookingsCount cheapestPrice");

        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
};

export const getHotelsByCityName = async (req, res, next) => {
    const cityName = req.params.city;
    try {
        const hotels = await Hotel.find({ city: cityName });
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
}

export const getHotelsByHotelType = async (req, res, next) => {
    const type = req.params.hotelType;
    try {
        const hotels = await Hotel.find({ type: type });
        res.status(200).json(hotels);
    } catch (err) {
        next(err);
    }
}

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
                    count: { $sum: 1 },
                    desc: { $first: "$desc" }
                }
            },
            {
                $project: {
                    _id: 0,
                    city: "$_id",
                    count: 1,
                    desc: 1
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
        const hotelCount = await Hotel.countDocuments({ type: "Hotel" });
        const apartmentCount = await Hotel.countDocuments({ type: "Apartment" });
        const resortCount = await Hotel.countDocuments({ type: "Resort" });
        const villaCount = await Hotel.countDocuments({ type: "Villa" });
        const cabinCount = await Hotel.countDocuments({ type: "Cabin" });
        res.status(200).json([
            { type: "Hotel", count: hotelCount },
            { type: "Apartment", count: apartmentCount },
            { type: "Resort", count: resortCount },
            { type: "Villa", count: villaCount },
            { type: "Cabin", count: cabinCount },
        ]);
    } catch (err) {
        next(err);
    }
};