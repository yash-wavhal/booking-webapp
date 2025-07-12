import { useState } from "react";
import RoomPhotosLightbox from "./RoomPhotosLightbox";

interface RoomCardProps {
  room: {
    _id: string;
    title: string;
    price: number;
    maxPeople: number;
    desc: string;
    roomNumbers: { number: number }[];
    photos: string[];
  };
}

const RoomCard = ({ room }: RoomCardProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-white rounded-lg p-5 shadow-md hover:shadow-xl transition cursor-pointer">
      {lightboxOpen && (
        <RoomPhotosLightbox
          photos={room.photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {room.photos && room.photos.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-2">
          {room.photos?.slice(0, 4)?.map((photoUrl, idx) => (
            <img
              key={idx}
              src={photoUrl}
              alt={`${room.title} photo ${idx + 1}`}
              className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition"
              onClick={() => openLightboxAt(idx)}
            />
          ))}
        </div>
      )}

      <h3 className="text-xl font-semibold text-indigo-900 mb-2">
        {room.title}
      </h3>
      <p className="text-gray-700 mb-3">{room.desc}</p>
      <div className="flex justify-between items-center text-indigo-800 font-semibold mb-1">
        <span>Total {room.roomNumbers.length} Rooms</span>
      </div>
      <div className="flex justify-between items-center text-indigo-800 font-semibold">
        <span>👥 Max {room.maxPeople} / Room</span>
        <span>${room.price} / Room</span>
      </div>
      <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full py-2 font-semibold transition">
        Book This Room
      </button>
    </div>
  );
};

export default RoomCard;
