import { useNavigate, useParams } from "react-router-dom";
import HotelDetails from "../../components/hotelDetails/HotelDetails";
import RoomCard from "../../components/roomDetails/RoomCard";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  createdAt: string;
  title: string;
  desc: string;
  rating: number;
  cheapestPrice: number;
  ownerId: string;
}

interface Room {
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
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Hotel = () => {
  const { hotelid } = useParams();
  const { user } = useAuth();
  const currentUserId = user?._id;
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("hotelFormData");
    localStorage.removeItem("newHotelId");
    localStorage.setItem("hotelCreationStep", "1");
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/hotels/find/${hotelid}`);
        setHotel(res.data);
      } catch (err) {
        setError(true);
        console.log(err);
        toast.error("Error while fetching hotel");
      } finally {
        setLoading(false);
      }
      fetchRooms();
    }
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/rooms/byhotel/${hotelid}`);
        setRooms(res.data);
      } catch (err) {
        setError(true);
        console.log(err);
        toast.error("Error while fetching rooms");
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  const handleRoomDelete = async (roomId: string, hotelId: string) => {
    try {
      await axios.delete(`${BASE_URL}/rooms/${user?._id}/${roomId}/${hotelId}`);
      setRooms((prevRooms) => prevRooms?.filter(room => room._id !== roomId) || null);
      toast.success("Room deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Error while deleting the rrom, please try again!")
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center text-xl text-blue-600 font-semibold">
        Loading details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Failed to load hotel
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-10 text-center text-gray-700">No hotel data found</div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto">
        <HotelDetails hotel={hotel} />
      </div>

      <section className="w-full max-w-7xl mx-auto mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Available Rooms
          </h2>
          <button
            onClick={() => navigate(`/hotels/edit-rooms?hotelId=${hotel._id}`)}
            className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
          >
            + Add Room
          </button>
        </div>

        {error && (
          <p className="text-red-600 font-semibold mb-4">
            Failed to load rooms data
          </p>
        )}

        {!loading && rooms?.length === 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-600 font-medium border border-gray-200">
            No rooms available for this hotel.
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <RoomCard
              key={room._id}
              room={room}
              hoteluserid={hotel.ownerId}
              onDelete={handleRoomDelete}
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Hotel;
