import { useState } from "react";
import RoomPhotosLightbox from "../roomDetails/RoomPhotosLightbox";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

interface Room {
    _id: string
    title: string;
    price: number;
    maxPeople: number;
    desc: string;
    roomNumbers: { number: number }[];
    hotelId: string;
    photos: string[];
    extraGuestCharge: number;
    maxExtraGuests: number;
    extraBedCharge: number;
    maxExtraBeds: number;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BookRoomModal = ({ room, onClose, hotelownerid, onDelete }: { room: Room; onClose: () => void, hotelownerid: string, onDelete: (roomId: string, hotelId: string) => void}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const userid = user?._id;

    const searchParams = new URLSearchParams(location.search);

    const openLightboxAt = (idx: number) => {
        setLightboxOpen(true);
        setLightboxIndex(idx);
    };

    

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            {lightboxOpen && (
                <RoomPhotosLightbox
                    photos={room.photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}

            <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
                {/* Photos Row */}
                {room.photos?.length > 0 && (
                    <div className="flex gap-3 mb-5 overflow-x-auto pb-2 border-b">
                        {room.photos.map((photoUrl, idx) => (
                            <img
                                key={idx}
                                src={photoUrl}
                                alt={`${room.title} ${idx + 1}`}
                                className="w-48 h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                                onClick={() => openLightboxAt(idx)}
                            />
                        ))}
                    </div>
                )}

                {/* Title + Description */}
                <h2 className="text-xl font-bold text-gray-900">{room.title}</h2>
                <p className="text-gray-600 mt-1 mb-5">{room.desc}</p>

                {/* Room Details */}
                <div className="grid sm:grid-cols-2 gap-4 text-sm border-t pt-4">
                    <p>
                        <span className="font-semibold">Price:</span> ₹{room.price} / night
                    </p>
                    <p>
                        <span className="font-semibold">Max People:</span> {room.maxPeople}
                    </p>
                    <p>
                        <span className="font-semibold">Extra Guests:</span> Up to {room.maxExtraGuests} (₹{room.extraGuestCharge} each)
                    </p>
                    <p>
                        <span className="font-semibold">Extra Beds:</span> Up to {room.maxExtraBeds} (₹{room.extraBedCharge} each)
                    </p>
                </div>

                {/* Available Rooms */}
                <div className="mt-4">
                    <p className="text-gray-800 font-semibold mb-2">Available Rooms:</p>
                    <div className="flex flex-wrap gap-2">
                        {room.roomNumbers.map((r, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md border text-sm"
                            >
                                #{r.number}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                    <button
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-sm font-medium"
                        onClick={onClose}
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onDelete(room._id, room.hotelId)}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                    >
                        Delete Room
                    </button>
                </div>
            </div>
        </div>

    );
};

export default BookRoomModal;