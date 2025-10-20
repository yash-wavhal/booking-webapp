import React from "react";
import { useNavigate } from "react-router-dom";

// interface RoomNumberDetails {
//     number: number;
//     noOfExtraGuests: number;
//     noOfExtraBeds: number;
// }

interface RoomDetails {
    number: number;
    noOfExtraGuests: number;
    noOfExtraBeds: number;
    people: { adult: number; children: number };
}

interface Hotel {
    _id: string;
    name: string;
    city: string;
    address: string;
    desc: string;
    photos: string[];
    rating: number;
}

interface Booking {
    _id: string;
    hotelId: Hotel;
    roomId: { _id: string; title: string; price: number };
    roomDetails: RoomDetails[];
    checkInDate: string;
    checkOutDate: string;
}

interface Props {
    booking: Booking | null;
    onClose: () => void;
    onDelete: (id: string) => void;
}

const BookingDetailsModal: React.FC<Props> = ({ booking, onClose, onDelete }) => {
    const navigate = useNavigate();
    if (!booking) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4 backdrop-blur-sm">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8 relative animate-fadeIn border border-gray-100
               max-h-[85vh] overflow-y-auto"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6 border-b pb-3">
                    <div className="flex flex-wrap items-center gap-5">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-indigo-800">
                            {booking.hotelId.name}
                        </h2>
                        <span className="bg-indigo-600 text-white text-sm mt-1 px-3 py-1 rounded-full shadow-md flex items-center">
                            ⭐ {booking.hotelId.rating || "N/A"}
                        </span>
                    </div>
                    <button
                        className="text-gray-400 hover:text-red-500 text-2xl font-bold transition transform hover:scale-110"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Main content grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Left panel */}
                    <div>
                        <img
                            src={booking.hotelId.photos?.[0] || "/demo_hotel_image.avif"}
                            alt={booking.hotelId.name}
                            className="w-full h-64 object-cover rounded-xl shadow-lg"
                        />

                        <div className="mt-5 space-y-3">
                            <p className="text-gray-700 text-lg leading-relaxed">{booking.hotelId.desc}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                📍 {booking.hotelId.address}, {booking.hotelId.city}
                            </p>
                            <p className="text-2xl font-bold text-indigo-700">
                                ₹ {booking.roomId.price} / night
                            </p>
                        </div>
                    </div>

                    {/* Right panel */}
                    <div className="flex flex-col">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Booking Details</h3>

                        <div className="bg-gray-50 p-4 rounded-xl shadow-inner space-y-2 mb-5">
                            <p><strong>Check-in:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                            <p><strong>Check-out:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                        </div>

                        <p className="text-xl font-bold text-indigo-800 mb-3">{booking.roomId.title}</p>

                        <h4 className="text-lg font-semibold mb-3">Rooms Booked</h4>
                        <div
                            className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scroll"
                            style={{ scrollbarGutter: 'stable' }}
                        >
                            {booking.roomDetails.map((room, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gradient-to-r from-indigo-50 to-white"
                                >
                                    <p className="font-medium text-gray-800">
                                        🏨 Room Numbers: {room.number}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        👨 Guests: {room.people.adult} Adults, {room.people.children} Children
                                    </p>
                                    <p className="text-sm">🛏 Extra Beds: {room.noOfExtraBeds}</p>
                                    <p className="text-sm">➕ Extra Guests: {room.noOfExtraGuests}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="mt-8 flex justify-end gap-4 border-t pt-5">
                    <button
                        className="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition shadow-sm"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
                        onClick={() => {
                            navigate(`/hotels/${booking.hotelId._id}`);
                            onClose();
                        }}
                    >
                        View Hotel
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold shadow-md hover:bg-red-700 transition"
                        onClick={() => {
                            booking && onDelete(booking._id);
                        }}
                    >
                        Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;