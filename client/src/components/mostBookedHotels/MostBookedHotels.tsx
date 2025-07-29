import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import HotelCardList from "../horizontalHotelList/HotelCardList";

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
  bookingsCount: number;
  cheapestPrice: number;
}

const MostBookedHotels: React.FC = () => {
  const { data, loading, error } = useFetch<Hotel[]>("/hotels/mostbooked");
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">Something went wrong!</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto relative">
      <HotelCardList
        data={data || []}
        loading={loading}
        setSelectedHotel={setSelectedHotel}
      />

      {selectedHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
          <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative animate-fadeIn">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">
              {selectedHotel.name}
            </h3>

            <img
              src={
                selectedHotel.photos?.[0] ||
                "https://via.placeholder.com/600x400.png?text=No+Image"
              }
              alt={selectedHotel.name}
              className="w-full h-52 object-cover rounded-lg mb-4"
            />

            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-semibold text-gray-900">{selectedHotel.desc}</p>
              <p>
                <span className="font-semibold text-gray-900">City:</span>{" "}
                {selectedHotel.city}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Address:</span>{" "}
                {selectedHotel.address}
              </p>
              <p>
                <span className="font-semibold text-gray-900">Distance:</span>{" "}
                {selectedHotel.distance}
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
                onClick={() => setSelectedHotel(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
                onClick={() => {
                  navigate(`/hotels/${selectedHotel._id}`);
                  setSelectedHotel(null);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MostBookedHotels;