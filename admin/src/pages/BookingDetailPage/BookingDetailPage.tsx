import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bed, Users, CalendarDays, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

interface Booking {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
    city: string;
    address: string;
    createdAt: string;
    distance: string;
    photos: string[];
    title: string;
    desc: string;
    rating: number;
    cheapestPrice: number;
  };
  hotelOwnerId: {
    _id: string;
    username: string;
    email: string;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  roomId: {
    title: string;
    price: number;
    maxPeople: number;
  };
  amountPaid: number;
  roomDetails: Array<{
    number: number;
    noOfExtraGuests: number;
    noOfExtraBeds: number;
    people: {
      adult: number;
      children: number;
    };
  }>;
  checkInDate: string;
  checkOutDate: string;
  createdAt: string;
  updatedAt: string;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BookingDetailPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
          withCredentials: true,
        });
        setBooking(res.data);
      } catch (err) {
        toast.error("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    try {
      await axios.delete(`${BASE_URL}/bookings/cancel/${booking?._id}/${user?._id}`, { withCredentials: true });
      toast.success("Booking cancelled successfully");
      navigate("/bookings");
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const cancelBookingUsingRoomNumber = async (number: number) => {
    try {
      await axios.patch(
        `${BASE_URL}/bookings/cancel/${booking?._id}/${user?._id}`,
        { number },
        { withCredentials: true }
      );

      setBooking((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          roomDetails: prev.roomDetails.filter((room) => room.number !== number),
        };
      });

      toast.success(`Booking cancelled successfully for room number ${number}`);
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  if (loading) return <div className="p-6">Loading booking details...</div>;
  if (!booking) return <div className="p-6 text-red-600">Booking not found</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row max-w-7xl mx-auto my-8 hover:shadow-lg transition-shadow duration-200">
        <div className="relative lg:w-1/3 h-[250px] lg:h-[350px] group">
          <img
            src={booking.hotelId?.photos[0] || "/demo_hotel_image.avif"}
            alt="hotel"
            className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        <div className="relative flex-1 p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-2">
            <h1 className="text-3xl font-semibold text-blue-800">{booking.hotelId.name}</h1>
            <span className="text-sm text-gray-500">
              Booking: {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">{booking.hotelId.title}</h1>

          <div className="text-md text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            {booking.hotelId.address} • {booking.hotelId.city}
          </div>

          <div className="flex flex-wrap gap-6 text-md">
            <span>
              <span className="text-gray-500">Distance:</span>{" "}
              <span className="font-medium">{booking.hotelId.distance}</span>
            </span>
            <span>
              <span className="text-gray-500">Rating:</span>{" "}
              <span className="font-medium">
                {typeof booking.hotelId.rating === "number" ? booking.hotelId.rating.toFixed(1) : "N/A"}
              </span>
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-6 border-t pt-3">
            {booking.hotelId.desc}
          </p>

          <div className="absolute right-9 bottom-5 pt-2 flex gap-3 justify-end">
            <button
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 focus:outline-none"
              onClick={() => navigate(`/hotels/${booking.hotelId._id}`)}
            >
              View Hotel
            </button>
            <button
              className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700 focus:outline-none"
              onClick={() => handleCancelBooking()}
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg mb-2">Booked By</h2>
            <button className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-blue-700 transition"
              onClick={() => { navigate(`/users/${booking.hotelOwnerId._id}`) }}
            >
              View User
            </button>
          </div>
          <p><strong>{booking.hotelOwnerId.username}</strong></p>
          <p className="text-gray-600">{booking.hotelOwnerId.email}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-600">
          <div className="flex justify-between">
            <h2 className="font-semibold text-lg mb-2">Booked By</h2>
            <button className="bg-green-600 text-white px-4 py-1.5 text-sm rounded-lg hover:bg-green-700 transition"
              onClick={() => { navigate(`/users/${booking.userId._id}`) }}
            >
              View User
            </button>
          </div>
          <p><strong>{booking.userId.username}</strong></p>
          <p className="text-gray-600">{booking.userId.email}</p>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-5 mb-4">
          <h2 className="text-2xl font-semibold">Booked Rooms</h2>
          <button
            className="bg-green-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-green-700 transition"
            onClick={() => navigate(`/hotels/${booking.hotelId._id}`)}
          >
            View Room
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {booking.roomDetails.map((detail, i) => (
            <div
              key={i}
              className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-600 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Bed /> {booking.roomId.title}
                </h3>
                <p className="text-gray-700">₹{booking.roomId.price} / Night</p>
                <p className="text-gray-700 flex items-center gap-2 mt-1">
                  <Users /> Max {booking.roomId.maxPeople} People
                </p>
                <div className="flex gap-12 mt-3">
                  <div>
                    <p><strong>Adults:</strong> {detail.people.adult}</p>
                    <p><strong>Children:</strong> {detail.people.children}</p>
                  </div>
                  <div>
                    <p><strong>Extra Guests:</strong> {detail.noOfExtraGuests}</p>
                    <p><strong>Extra Beds:</strong> {detail.noOfExtraBeds}</p>
                  </div>
                </div>
                <p className="mt-3 text-gray-600"><strong>Room Number:</strong> {detail.number}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => cancelBookingUsingRoomNumber(detail.number)}
                  className="px-4 py-1 text-black bg-red-100 border border-red-700 rounded hover:bg-red-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between bg-white rounded-lg shadow-lg p-6 mt-6 border-l-4 border-indigo-600">
        {/* Dates Section */}
        <div className="mb-4 md:mb-0">
          <h2 className="font-semibold text-xl text-indigo-700 mb-3">Booking Dates</h2>
          <p className="flex items-center gap-2">
            <CalendarDays className="text-indigo-800" />
            <span className="font-medium">Check-in:</span> {new Date(booking.checkInDate).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2 mt-1">
            <CalendarDays className="text-indigo-800" />
            <span className="font-medium">Check-out:</span> {new Date(booking.checkOutDate).toLocaleDateString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last Updated: {new Date(booking.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className="flex flex-col justify-center bg-indigo-50 rounded-lg p-4 shadow-inner md:ml-6">
          <h2 className="text-lg font-semibold text-indigo-700 mb-2">Total Amount Paid</h2>
          <p className="text-2xl font-bold text-indigo-900">₹{booking.amountPaid.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;