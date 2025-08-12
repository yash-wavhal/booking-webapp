import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface Booking {
  _id: string;
  hotelId: {
    name: string;
    address: string;
    city: string;
  };
  hotelOwnerId: {
    username: string;
    email: string;
  };
  userId: {
    username: string;
    email: string;
  };
  roomId: {
    title: string;
    price: number;
    maxPeople: number;
  };
  roomDetails: Array<{
    roomNumbers: Array<{
      number: number;
      noOfExtraGuests: number;
      noOfExtraBeds: number;
    }>;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/bookings/${bookingId}`, {
          withCredentials: true,
        });
        setBooking(res.data);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="p-6">Loading booking details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!booking) return <div className="p-6">Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow-lg mt-6">
      <Link
        to="/bookings"
        className="text-indigo-600 hover:underline mb-4 inline-block"
      >
        &larr; Back to Bookings
      </Link>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Booking Details</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Hotel Info</h2>
        <p><strong>Name:</strong> {booking.hotelId.name}</p>
        <p><strong>Address:</strong> {booking.hotelId.address}, {booking.hotelId.city}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Hotel Owner</h2>
        <p><strong>Username:</strong> {booking.hotelOwnerId.username}</p>
        <p><strong>Email:</strong> {booking.hotelOwnerId.email}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Booked By (User)</h2>
        <p><strong>Username:</strong> {booking.userId.username}</p>
        <p><strong>Email:</strong> {booking.userId.email}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Room Info</h2>
        <p><strong>Title:</strong> {booking.roomId.title}</p>
        <p><strong>Price per Night:</strong> ₹{booking.roomId.price}</p>
        <p><strong>Max People:</strong> {booking.roomId.maxPeople}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Room Details</h2>
        {booking.roomDetails.map((detail, i) => (
          <div key={i} className="mb-4 p-4 border rounded border-gray-200">
            <p><strong>Adults:</strong> {detail.people.adult}</p>
            <p><strong>Children:</strong> {detail.people.children}</p>
            <div>
              <strong>Room Numbers:</strong>
              <ul className="list-disc ml-6 mt-1">
                {detail.roomNumbers.map((room, idx) => (
                  <li key={idx}>
                    Number: {room.number}, Extra Guests: {room.noOfExtraGuests}, Extra Beds: {room.noOfExtraBeds}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <p><strong>Check-in Date:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>
        <p><strong>Check-out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
      </section>

      <section>
        <p><strong>Created At:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
        <p><strong>Last Updated:</strong> {new Date(booking.updatedAt).toLocaleString()}</p>
      </section>
    </div>
  );
};

export default BookingDetailPage;