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
}

const RoomCard = ({ room, hoteluserid }: RoomCardProps) => {
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

  // useEffect(() => {
  //   localStorage.setItem("hotelCreationStep", "1");
  //   localStorage.removeItem("newHotelId");
  // }, []);

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
        <div className="mb-6 grid grid-cols-2 gap-2 h-48">
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

      <div className="h-40">
        <h3 className="text-xl font-semibold text-indigo-900 mb-2">
          {room.title}
        </h3>
        <p className="h-16 text-gray-700 mb-3">{room.desc}</p>
        <div className="flex justify-between items-center text-indigo-800 font-semibold mb-1">
          <span>Total {room.roomNumbers.length} Rooms Available</span>
        </div>
        <div className="flex justify-between items-center text-indigo-800 font-semibold">
          <span>👥 Max {room.maxPeople} / Room</span>
          <span>₹{room.price} / Room</span>
        </div>
      </div>
      {hoteluserid === userid ? (
        <div className="mt-6 flex justify-between flex-col sm:flex-row gap-3 sm:gap-4">
          <button onClick={() => navigate(`/hotels/edit-rooms?hotelId=${room.hotelId}`)} className="w-full sm:w-auto px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2">
            <Pencil className="w-4 h-4" />
            Edit Room
          </button>
          <button onClick={() => setRoomModal(true)} className="w-full sm:w-auto px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all duration-200">
            View Room
          </button>
        </div>
      ) : (
        <button onClick={() => setRoomModal(true)} className="mt-6 w-full px-6 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md transition-all duration-200">
          Book This Room
        </button>
      )}
      {roomModal && (
        <BookRoomModal
          room={room}
          onClose={() => setRoomModal(false)}
          hotelownerid={hoteluserid}
        />
      )}
    </div>
  );
};

export default RoomCard;
