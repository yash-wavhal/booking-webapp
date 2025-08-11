import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../../components/sideBar/SideBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface Hotel {
  _id: string;
  name: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  rooms: string[];
  type: string;
  desc: string;
  rating: number;
  cheapestPrice: number;
  ownerId: string;
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function HotelManagement() {
  const { user } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/hotels/${user?._id}`);
        setHotels(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/hotels/admin/${hotelId}`);
      setHotels(prevhotels => prevhotels.filter(hotel => hotel._id !== hotelId));
    } catch (err) {
      console.log(err);
      toast.error("Error deleting hotel, please try again!");
    }
  }

  const filteredHotels = hotels.filter((hotel) =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto mt-8 font-sans text-center text-gray-500">
        Loading hotels...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 font-sans">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold capitalize">Hotels</h2>
        <button
          onClick={() => navigate("/hotels/create")}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
        >
          Add Hotel
        </button>
      </div>

      <div className="mb-5 flex-grow min-w-[200px] sm:min-w-[100px]">
        <input
          type="text"
          placeholder="Search hotel by name or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full border-collapse bg-white text-left text-sm text-gray-600">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3 text-center">
                <input type="checkbox" />
              </th>
              <th className="w-40 py-3">ID</th>
              <th className="w-48 pl-4 py-3">Name</th>
              <th className="w-32 py-3">Type</th>
              <th className="w-48 px-4 py-3">Title</th>
              <th className="w-32 pl-4 py-3">City</th>
              <th className="w-24 py-3">Min Price</th>
              <th className="w-36 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.map((hotel) => (
              <tr key={hotel._id} className="border-t border-gray-200">
                <td className="w-12 px-4 py-3 text-center">
                  <input type="checkbox" />
                </td>
                <td className="w-40 py-3 text-gray-700">{hotel._id}</td>
                <td className="w-48 pl-4 py-3">{hotel.name}</td>
                <td className="w-32 py-3">{hotel?.type ?? "N/A"}</td>
                <td className="w-48 px-4 py-3">{hotel?.title ?? "N/A"}</td>
                <td className="w-32 pl-4 py-3">{hotel?.city ?? "N/A"}</td>
                <td className="w-24 py-3">{hotel.rooms.length}</td>
                <td className="w-36 py-3 text-center">
                  <div className="flex gap-2">
                    <button
                      className="rounded border border-indigo-600 bg-white px-2 py-1 text-indigo-600 text-sm hover:bg-indigo-50"
                      type="button"
                      onClick={() => { navigate(`/hotels/${hotel._id}`) }}
                    >
                      View
                    </button>
                    <button
                      className="rounded border border-red-400 bg-white px-2 py-1 text-red-500 text-sm hover:bg-red-50"
                      type="button"
                      onClick={() => handleDeleteHotel(hotel._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}