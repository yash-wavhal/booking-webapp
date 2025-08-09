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
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/hotels/find/${hotelid}`);
        setHotel(res.data);
      } catch(err) {
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
      } catch(err) {
        setError(true);
        console.log(err);
        toast.error("Error while fetching rooms");
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, [])

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
    <main className="bg-white mx-auto">
      <HotelDetails hotel={hotel} />

      <section className="w-full max-w-7xl mx-auto mt-14">
        <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">
          Available Rooms
        </h2>

        {error && (
          <p className="text-red-600 font-semibold mb-4">
            Failed to load rooms data
          </p>
        )}

        {!loading && rooms?.length === 0 && (
          <div className="text-gray-600 font-medium">
            <p>No rooms available for this hotel.</p>

            {hotel.ownerId === currentUserId && (
              <button
                onClick={() =>
                  navigate(`/hotels/edit-rooms?hotelId=${hotel._id}`)
                }
                className="mt-4 px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md transition-all duration-200"
              >
                + Add Room
              </button>
            )}
          </div>
        )}


        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms?.map((room) => (
            <RoomCard key={room._id} room={room} hoteluserid={hotel.ownerId} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Hotel;
