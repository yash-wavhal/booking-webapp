import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import useFetch from "../../hooks/useFetch";
import HotelDetails from "../../components/hotelDetails/HotelDetails";
import RoomCard from "../../components/roomDetails/RoomCard";
import { useAuth } from "../../context/AuthContext";

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
}

const Hotel = () => {
  const { hotelid } = useParams();
  const { user } = useAuth();
  const currentUserId = user?._id;

  const navigate = useNavigate();

  const {
    data: hotel,
    loading: hotelLoading,
    error: hotelError,
  } = useFetch<Hotel>(`/hotels/find/${hotelid}`);

  const {
    data: rooms,
    loading: roomsLoading,
    error: roomsError,
  } = useFetch<Room[]>(`/rooms/byhotel/${hotelid}`);

  // console.log("room", rooms);
  // console.log("hotel", hotel);

  if (hotelLoading || roomsLoading) {
    return (
      <div className="p-10 text-center text-xl text-blue-600 font-semibold">
        Loading details...
      </div>
    );
  }

  if (hotelError) {
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
    <div className="bg-gradient-to-b from-indigo-50 to-white min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto p-10 pt-0">
        <HotelDetails hotel={hotel} />

        <section className="mt-14">
          <h2 className="text-3xl font-extrabold text-indigo-900 mb-6">
            Available Rooms
          </h2>

          {roomsError && (
            <p className="text-red-600 font-semibold mb-4">
              Failed to load rooms data
            </p>
          )}

          {!roomsLoading && rooms?.length === 0 && (
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

      {/* <MailList /> */}
      <Footer />
    </div>
  );
};

export default Hotel;
