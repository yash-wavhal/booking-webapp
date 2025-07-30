import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import CityCardSkeleton from "../skeletons/HomeSkeleton";
import { useRef } from "react";

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

interface Props {
  data: Hotel[];
  loading: boolean;
  setSelectedHotel: (hotel: Hotel) => void;
}

const HotelCardList: React.FC<Props> = ({ data, loading, setSelectedHotel }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  return (
    <div className="relative">
      {/* Left Button */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollLeft}
      >
        <ChevronLeft />
      </button>

      {/* Scrollable Hotel Cards */}
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
        {(loading ? Array(4).fill(null) : data).map((hotel, i) =>
          loading ? (
            <CityCardSkeleton key={i} />
          ) : (
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
                  "https://img.freepik.com/free-photo/type-entertainment-complex-popular-resort-with-pools-water-parks-turkey-with-more-than-5-million-visitors-year-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer_146671-18728.jpg"
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
                  Available at affordable rates
                </Typography>
                <Typography className="bg-blue-900 text-white w-16 px-3 py-1 rounded-sm font-bold shadow-md flex items-center">
                  <span>{hotel.rating ? hotel.rating : "N/A"}</span>
                  <span className="ml-1">★</span>
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>

      {/* Right Button */}
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
        onClick={scrollRight}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default HotelCardList;