import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import useFetch from "../../hooks/useFetch";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";
import toast from "react-hot-toast";

interface RoomData {
  roomNumber: number;
  extraGuests: number;
  extraBeds: number;
}

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

interface RoomNumber {
  number: number;
  unavailableDates: Date[];
  _id: string;
}

interface Room {
  _id: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
  roomNumbers: RoomNumber[];
  hotelId: Hotel;
  photos: string[];
  extraGuestCharge: number;
  maxExtraGuests: number;
  extraBedCharge: number;
  maxExtraBeds: number;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const PaymentPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { user } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();

  const adult = Number(searchParams.get("adult")) || 1;
  const children = Number(searchParams.get("children")) || 0;
  const startDate = searchParams.get("startDate")
    ? new Date(searchParams.get("startDate")!)
    : new Date();
  const endDate = searchParams.get("endDate")
    ? new Date(searchParams.get("endDate")!)
    : new Date(new Date().getTime() + 86400000);

  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hotelId, setHotelId] = useState<Hotel | null>(null);

  const { data: room, loading, error } = useFetch<Room>(`/rooms/${roomId}`);

  useEffect(() => {
    const savedBooking = localStorage.getItem(`booking-${roomId}`);
    const bookingData = localStorage.getItem("bookingData");

    if (savedBooking) {
      const parsed = JSON.parse(savedBooking);
      if (parsed.roomsData) setRoomsData(parsed.roomsData);
    }

    if (bookingData) {
      const parsed = JSON.parse(bookingData);
      if (parsed.totalPrice) setTotalPrice(parsed.totalPrice);
      if (parsed.hotelId) setHotelId(parsed.hotelId);
    }
  }, [roomId]);

  const roomDetails = roomsData.map((roomItem) => ({
    roomId,
    roomNumbers: [
      {
        number: roomItem.roomNumber,
        noOfExtraGuests: roomItem.extraGuests,
        noOfExtraBeds: roomItem.extraBeds,
      },
    ],
    people: { adult, children },
  }));

  const handlePayment = async () => {
    if (!hotelId || !roomId || !user?._id) {
      alert("Missing booking data or user information.");
      return;
    }

    const payload = {
      hotelId,
      hotelOwnerId: room?.hotelId?.ownerId,
      userId: user._id,
      roomId,
      roomDetails,
      checkInDate: startDate,
      checkOutDate: endDate,
    };

    try {
      await axios.post(`${BASE_URL}/bookings/${user._id}`, payload);

      const getDatesInRange = (start: Date, end: Date) => {
        const dates: Date[] = [];
        let current = new Date(start);
        while (current <= end) {
          dates.push(new Date(current));
          current.setDate(current.getDate() + 1);
        }
        return dates;
      };

      const allDates = getDatesInRange(startDate, endDate);

      const datePayload = {
        dates: allDates,
      };

      roomsData.map(async (r) => {
        await axios.put(
          `${BASE_URL}/rooms/available/${roomId}/${r.roomNumber}`, datePayload
        );
      });

      toast.success(
        "Thank you! Your stay is confirmed. You can view your booking details in your profile"
      );

      navigate(`/hotels/${hotelId._id}`);
      localStorage.removeItem("bookingData");
      localStorage.removeItem(`booking-${roomId}`);
    } catch (error) {
      toast.error("Booking failed. Please try again!");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-12 drop-shadow-lg">
          Confirm Your Booking & Payment
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 sm:p-14">
          {/* Stay Dates */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Your Stay Dates</h2>
            <div className="grid grid-cols-2 gap-6 bg-indigo-50 p-4 rounded-xl shadow-sm">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Check-In</span>
                <span className="text-lg font-semibold text-indigo-900">
                  {startDate.toDateString()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Check-Out</span>
                <span className="text-lg font-semibold text-indigo-900">
                  {endDate.toDateString()}
                </span>
              </div>
            </div>
          </section>

          {/* Members */}
          <section>
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Members</h2>
            <div className="grid grid-cols-2 gap-6 bg-indigo-50 p-4 rounded-xl shadow-sm max-w-md">
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Adults</span>
                <span className="text-lg font-semibold text-indigo-900">{adult}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">Children</span>
                <span className="text-lg font-semibold text-indigo-900">{children}</span>
              </div>
            </div>
          </section>

          {/* Selected Rooms */}
          <section className="mb-12 mt-10">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-700">
              Selected Rooms & Extras
            </h2>

            {roomsData.length === 0 ? (
              <p className="text-gray-500 text-lg">No rooms selected.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {roomsData.map((room) => (
                  <div
                    key={room.roomNumber}
                    className="border border-indigo-300 rounded-xl p-5 bg-indigo-50 shadow-sm hover:shadow-md transition"
                  >
                    <p className="text-lg font-semibold text-indigo-900 mb-2">
                      Room #{room.roomNumber}
                    </p>
                    <p className="text-gray-700">
                      Extra Guests: <span className="font-medium">{room.extraGuests}</span>
                    </p>
                    <p className="text-gray-700">
                      Extra Beds: <span className="font-medium">{room.extraBeds}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Booking Summary */}
          <section className="border-t border-indigo-300 pt-8">
            <h2 className="text-2xl font-semibold mb-7 text-indigo-700">Booking Summary</h2>
            <div className="flex gap-36 text-gray-800 text-md">
              <div>
                <p>
                  <span className="font-semibold">Check-in:</span> {startDate.toDateString()}
                </p>
                <p>
                  <span className="font-semibold">Check-out:</span> {endDate.toDateString()}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Guests:</span> {adult} Adult
                  {adult > 1 ? "s" : ""}, {children} Child
                  {children !== 1 ? "ren" : ""}
                </p>
                <p>
                  <span className="font-semibold">Total Price:</span> ₹
                  {totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          {/* Payment Button */}
          <button
            className="mt-12 w-full py-2 rounded-3xl font-extrabold text-xl text-white bg-indigo-700 hover:bg-indigo-800 shadow-lg transition"
            onClick={handlePayment}
          >
            Confirm & Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;