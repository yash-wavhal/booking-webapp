import React, { useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  return (
    <div className="max-w-7xl mx-auto my-6 relative">
      <h2 className="text-3xl text-gray-900 ml-4 font-bold mb-3">MOST BOOKED HOTELS</h2>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollLeft}
      >
        <ChevronLeft />
      </button>

      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          p: 2,
          scrollbarWidth: "none",
        }}
      >
        {data?.map((hotel) => (
          <Card
            key={hotel._id}
            sx={{
              minWidth: 300,
              minHeight: 400,
              borderRadius: 2,
              boxShadow: 3,
              cursor: "pointer",
            }}
            onClick={() => setSelectedHotel(hotel)}
            className="hover:scale-105 transform transition"
          >
            <CardMedia
              component="img"
              image={
                hotel.photos?.[0] ||
                "https://img.freepik.com/free-photo/type-entertainment-complex-popular-resort-with-pools-water-parks-turkey-with-more-than-5-million-visitors-year-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer_146671-18728.jpg?ga=GA1.1.1461544118.1750686394&semt=ais_items_boosted&w=740"
              }
              alt={hotel.name}
              sx={{
                height: 250,
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
              <Typography className="bg-blue-900 text-white w-16 px-3 py-1 rounded-sm font-bold shadow-md flex items-center">
                  <span>{hotel.rating}</span>
                  <span className="ml-1">★</span>
                </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
        onClick={scrollRight}
      >
        <ChevronRight />
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
            {/* <p>
              <strong>Rating:</strong> {selectedHotel.rating} ★
            </p> */}
            {/* <p>
              <strong>Bookings:</strong> {selectedHotel.bookingsCount}
            </p> */}
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
