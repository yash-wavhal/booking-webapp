import { useEffect, useState } from "react";
import RoomPhotosLightbox from "./RoomPhotosLightbox";
import { Pencil } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import BookRoomModal from "../bookroommodal/BookRoomModal";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  room: {
    _id: string;
    title: string;
    price: number;
    maxPeople: number;
    desc: string;
    roomNumbers: { number: number }[];
    photos: string[];
    hotelId: string;
    extraGuestCharge: number;
    maxExtraGuests: number;
    extraBedCharge: number;
    maxExtraBeds: number;
  };
  hoteluserid: string;
  onDelete: (roomId: string, hotelId: string) => void;
}

const RoomCard = ({ room, hoteluserid, onDelete }: RoomCardProps) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [roomModal, setRoomModal] = useState(false);
  const [editRoomModal, setEditRoomModal] = useState(false);
  const { user } = useAuth();
  const userid = user?._id;
  const navigate = useNavigate();
  // console.log("hoteluseid", hoteluserid);
  // console.log("userid", userid);

  const openLightboxAt = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col max-w-4xl mx-auto">
      {/* Photos */}
      {lightboxOpen && (
        <RoomPhotosLightbox
          photos={room.photos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {room.photos?.length > 0 && (
        <div className="min-h-64 grid grid-cols-2 gap-2 p-3 bg-gray-50">
          {room.photos.slice(0, 4).map((photoUrl, idx) => (
            <img
              key={idx}
              src={photoUrl}
              alt={`${room.title} photo ${idx + 1}`}
              className="w-full h-28 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform"
              onClick={() => openLightboxAt(idx)}
            />
          ))}
        </div>
      )}

      <div className="p-6 flex flex-col gap-3">
        <div className="flex justify-between items-start border-b pb-2">
          <h3 className="text-xl font-semibold text-gray-800">{room.title}</h3>
          <span className="text-sm text-gray-500">
            ₹{room.price} / Room
          </span>
        </div>

        <p className="text-sm min-h-14 text-gray-600 leading-5 line-clamp-3">
          {room.desc}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-700">
          <span>
            🏠 {room.roomNumbers.length} Rooms Available
          </span>
          <span>
            👥 Max {room.maxPeople} / Room
          </span>
        </div>

        <div className="pt-3 flex gap-3">
          <button
            onClick={() => navigate(`/hotels/edit-rooms?hotelId=${room.hotelId}`)}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700"
          >
            Edit Room
          </button>
          <button
            onClick={() => setRoomModal(true)}
            className="px-4 py-1.5 bg-gray-700 text-white text-sm rounded-lg shadow hover:bg-gray-800"
          >
            View Room
          </button>
        </div>
      </div>

      {roomModal && (
        <BookRoomModal
          room={room}
          onClose={() => setRoomModal(false)}
          hotelownerid={hoteluserid}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default RoomCard;
