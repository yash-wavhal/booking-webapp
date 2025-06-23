import React, { useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const navigate = useNavigate();

  if (loading) {
    return <div className="text-center p-4">Loading hotels...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-4 text-red-500">Something went wrong!</div>
    );
  }

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="max-w-6xl mx-auto my-6 relative">
      <h2 className="text-2xl font-bold mb-3">Most Booked Hotels</h2>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
        onClick={scrollLeft}
      >
        <FaChevronLeft />
      </button>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          p: 2,
          scrollbarWidth: "none", // Firefox
          "&::-webkit-scrollbar": {
            display: "none", // Chrome, Safari, Opera
          },
        }}
      >
        {data?.map((hotel) => (
          <Card
            key={hotel._id}
            sx={{
              minWidth: 250,
              borderRadius: 2,
              boxShadow: 3,
              cursor: "pointer",
            }}
            onClick={() => setSelectedHotel(hotel)}
          >
            <CardMedia
              component="img"
              image={
                hotel.photos?.[0] ||
                "https://via.placeholder.com/300x200.png?text=No+Image"
              }
              alt={hotel.name}
              sx={{
                height: 160,
                objectFit: "cover",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            />
            <CardContent>
              <Typography variant="h6">{hotel.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {hotel.city}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                ₹{hotel.cheapestPrice} / night
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
        onClick={scrollRight}
      >
        <FaChevronRight />
      </button>

      {selectedHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full relative">
            <h3 className="text-xl font-bold">{selectedHotel.name}</h3>
            <img
              src={
                selectedHotel.photos?.[0] ||
                "https://via.placeholder.com/600x400.png?text=No+Image"
              }
              alt={selectedHotel.name}
              className="w-full h-48 rounded mt-2 object-cover"
            />
            <p className="mt-3">{selectedHotel.desc}</p>
            <p>
              <strong>City:</strong> {selectedHotel.city}
            </p>
            <p>
              <strong>Address:</strong> {selectedHotel.address}
            </p>
            <p>
              <strong>Distance:</strong> {selectedHotel.distance}
            </p>
            <p>
              <strong>Rating:</strong> {selectedHotel.rating} ★
            </p>
            <p>
              <strong>Bookings:</strong> {selectedHotel.bookingsCount}
            </p>
            <p>
              <strong>Price:</strong> ₹{selectedHotel.cheapestPrice}
            </p>
            <div className="mt-3 flex justify-end space-x-2">
              <button
                className="bg-gray-300 rounded px-3 py-1"
                onClick={() => setSelectedHotel(null)}
              >
                Close
              </button>
              <button
                className="bg-blue-600 text-white rounded px-3 py-1"
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
