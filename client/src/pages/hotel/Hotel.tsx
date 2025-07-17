import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import useFetch from "../../hooks/useFetch";
import HotelDetails from "../../components/hotelDetails/HotelDetails";
import RoomCard from "../../components/roomDetails/RoomCard";

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
            <p className="text-gray-600 font-medium">
              No rooms available for this hotel.
            </p>
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
