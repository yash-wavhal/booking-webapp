import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Hotel {
    _id: string;
    name: string;
    city: string;
    address: string;
    distance: string;
    photos: string[];
    title: string;
    desc: string;
    rating: number;
    bookingsCount: number;
    cheapestPrice: number;
}

interface HotelListProps {
    hotel: Hotel;
    citytype?: string;
    isUser?: boolean;
    onDelete?: (id: string) => void; 
}

const HotelList = ({ hotel, citytype, isUser, onDelete }: HotelListProps) => {
    const navigate = useNavigate();

    return (
        <div>
            <div
                key={hotel._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col md:flex-row overflow-hidden border border-gray-200"
            >
                <div className="md:w-[240px] w-full h-[200px] md:h-auto overflow-hidden">
                    <img
                        src={hotel.photos?.[0] || "/demo_hotel_image.avif"}
                        alt={hotel.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                </div>

                {/* Hotel Details */}
                <div className="flex-1 p-6 flex flex-col justify-between gap-2">
                    <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-indigo-800">
                                {hotel.name}
                            </h2>
                            {citytype && (
                                <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-[2px] rounded-full font-medium whitespace-nowrap">
                                    {citytype}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 text-sm">
                            {hotel.address}, {hotel.city}
                        </p>

                        <p className="text-sm text-gray-800 font-semibold pt-1">{hotel.title}</p>
                        <p className="text-sm text-gray-700">{hotel.desc}</p>
                        <p className="text-sm text-green-700 font-medium">{hotel.distance}</p>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-md text-yellow-600 font-medium">Rating</span>
                            <span className="bg-yellow-500 text-white font-bold px-2 py-1 text-sm rounded">
                                {hotel.rating !== undefined && hotel.rating !== null
                                    ? hotel.rating.toFixed(1)
                                    : "N/A"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            {isUser && (
                                <button
                                    onClick={() => onDelete?.(hotel._id)}
                                    className="flex items-center gap-1 bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 transition"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            )}

                            <button
                                onClick={() => navigate(`/hotels/${hotel._id}`)}
                                className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelList;