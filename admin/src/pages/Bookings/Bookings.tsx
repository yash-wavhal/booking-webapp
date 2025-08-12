import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Booking {
  _id: string;
  hotelId: {
    _id: string;
    name: string;
  };
  hotelOwnerId: {
    _id: string;
    username: string;
  };
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  roomId: {
    _id: string;
    title?: string;
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
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const BookingManagementPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  console.log("bookings", bookings)
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/bookings/`, {
          withCredentials: true,
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDeleteBooking = async (id: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/bookings/cancel/${id}/${user?._id}`, { withCredentials: true });
      setBookings(prev => prev.filter(booking => booking._id !== id));
      toast.success("Booking cancelled successfully");
    } catch (err) {
      toast.error("Error canceling booking, please try again!");
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.hotelId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.userId.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.hotelOwnerId.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Booking Management</h2>
      <input
        type="text"
        placeholder="Search bookings by hotel, guest or owner..."
        className="mb-4 px-4 py-2 border rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {loading ? (
        <p>Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Booking ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Hotel</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Hotel Owner</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Guest</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Check-In</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Check-Out</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Guests</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Extras</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Booked On</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.map((booking) => {
                const totalAdults = booking.roomDetails.reduce(
                  (sum, detail) => sum + detail.people.adult,
                  0
                );
                const totalChildren = booking.roomDetails.reduce(
                  (sum, detail) => sum + detail.people.children,
                  0
                );
                const totalExtraGuests = booking.roomDetails.reduce(
                  (sum, detail) =>
                    sum +
                    detail.roomNumbers.reduce(
                      (subSum, rn) => subSum + rn.noOfExtraGuests,
                      0
                    ),
                  0
                );
                const totalExtraBeds = booking.roomDetails.reduce(
                  (sum, detail) =>
                    sum +
                    detail.roomNumbers.reduce(
                      (subSum, rn) => subSum + rn.noOfExtraBeds,
                      0
                    ),
                  0
                );

                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 font-mono">{booking._id}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{booking.hotelId?.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{booking.hotelOwnerId.username}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {/* {booking.userId.username} <br /> */}
                      <span className="text-xs text-gray-500">{booking.userId.email}</span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      Adults: {totalAdults} <br />
                      Children: {totalChildren}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      Extra Guests: {totalExtraGuests} <br />
                      Extra Beds: {totalExtraBeds}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/bookings/${booking._id}`)}
                        className="mr-2 px-3 py-1 text-indigo-600 border border-indigo-600 rounded hover:bg-indigo-50"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default BookingManagementPage;