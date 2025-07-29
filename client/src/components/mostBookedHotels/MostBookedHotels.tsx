import React, { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import HotelCardList from "../horizontalHotelList/HotelCardList";
import HotelDetailModal from "../hotelDetailModal/HotelDetailModal";

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
        <HotelDetailModal 
          selectedHotel={selectedHotel}
          onView={() => {
            navigate(`/hotels/${selectedHotel._id}`);
            setSelectedHotel(null);
          }}
          onCancel={() => setSelectedHotel(null)}
          isProfile={false}
        />
      )}
    </div>
  );
};

export default MostBookedHotels;