import { useState } from "react";
import RoomPhotosLightbox from "../roomDetails/RoomPhotosLightbox";
import { useLocation, useNavigate } from "react-router-dom";

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

const BookRoomModal = ({ room, onClose }: { room: Room; onClose: () => void}) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);

    const openLightboxAt = (idx: number) => {
        setLightboxOpen(true);
        setLightboxIndex(idx);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {lightboxOpen && (
                <RoomPhotosLightbox
                    photos={room.photos}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxOpen(false)}
                />
            )}

            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
                {room.photos?.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        {room.photos.map((photoUrl, idx) => (
                            <img
                                key={idx}
                                src={photoUrl}
                                alt={`${room.title} ${idx + 1}`}
                                className="w-52 h-44 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
                                onClick={() => openLightboxAt(idx)}
                            />
                        ))}
                    </div>
                )}

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{room.title}</h2>
                <p className="text-gray-600 mb-3">{room.desc}</p>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-semibold">Price:</span> ₹{room.price} / night</p>
                    <p><span className="font-semibold">Max People:</span> {room.maxPeople}</p>
                    <p><span className="font-semibold">Extra Guests:</span> Up to {room.maxExtraGuests} (₹{room.extraGuestCharge} each)</p>
                    <p><span className="font-semibold">Extra Beds:</span> Up to {room.maxExtraBeds} (₹{room.extraBedCharge} each)</p>
                </div>

                <div className="mt-3">
                    <p className="text-gray-700 font-semibold">Available Rooms:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {room.roomNumbers.map((r, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm">
                                #{r.number}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        onClick={() => navigate(`/book/${room._id}?${searchParams.toString()}`)}
                    >
                        Continue to Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookRoomModal;