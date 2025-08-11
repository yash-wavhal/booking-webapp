import { useState } from "react";
import {
  MapPin,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface HotelDetailsProps {
  hotel: {
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
}

const PHOTOS_PREVIEW_LIMIT = 6;

const HotelDetails = ({ hotel }: HotelDetailsProps) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const [open, setOpen] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { user } = useAuth();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const navigate = useNavigate();

  const photos = hotel.photos ?? [];
  const photosToShow = showAllPhotos
    ? photos
    : photos.slice(0, PHOTOS_PREVIEW_LIMIT);

  const handleOpen = (i: number) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (dir: "l" | "r") => {
    const photosLength = hotel.photos?.length || 0;
    setSlideNumber((prev) =>
      dir === "l"
        ? prev === 0
          ? photosLength - 1
          : prev - 1
        : prev === photosLength - 1
          ? 0
          : prev + 1
    );
  };

  const handleDeleteHotel = async (hotelId: string) => {
    try {
      const res = await axios.delete(`${BASE_URL}/hotels/admin/${hotelId}`);
      toast.success("Hotel deleted successfully!");
      navigate("/hotels");
    } catch (err) {
      console.log(err);
      toast.error("Error deleting hotel, please try again!");
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <X
            className="absolute top-4 right-4 text-white text-3xl cursor-pointer hover:text-red-400"
            onClick={() => setOpen(false)}
          />
          <ChevronLeft
            className="absolute left-6 text-white text-3xl cursor-pointer hover:text-gray-300"
            onClick={() => handleMove("l")}
          />
          <img
            src={hotel.photos[slideNumber] || "/demo_hotel_image.avif"}
            alt={`hotel image ${slideNumber + 1}`}
            className="max-h-[80vh] max-w-full object-contain rounded-md shadow-lg"
          />
          <ChevronRight
            className="absolute right-6 text-white text-3xl cursor-pointer hover:text-gray-300"
            onClick={() => handleMove("r")}
          />
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden flex flex-col lg:flex-row max-w-7xl mx-auto my-8 hover:shadow-lg transition-shadow duration-200">
        <div className="relative lg:w-1/3 h-[250px] lg:h-[350px] group">
          <img
            src={hotel.photos[0] || "/demo_hotel_image.avif"}
            alt="hotel"
            className="h-full w-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
            onClick={() => handleOpen(0)}
          />
          {/* <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent text-white p-3">
            <h2 className="text-xl font-semibold">{hotel.name}</h2>
          </div> */}
        </div>

        <div className="relative flex-1 p-6 space-y-4">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-2">
            <h1 className="text-3xl font-semibold text-blue-800">{hotel.name}</h1>
            <span className="text-sm text-gray-500">
              Added: {new Date(hotel.createdAt).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl font-semibold text-gray-800">{hotel.title}</h1>

          <div className="text-md text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            {hotel.address} • {hotel.city}
          </div>

          <div className="flex flex-wrap gap-6 text-md">
            <span>
              <span className="text-gray-500">Distance:</span>{" "}
              <span className="font-medium">{hotel.distance}</span>
            </span>
            <span>
              <span className="text-gray-500">Rating:</span>{" "}
              <span className="font-medium">
                {typeof hotel.rating === "number" ? hotel.rating.toFixed(1) : "N/A"}
              </span>
            </span>
          </div>

          <p className="text-sm text-gray-600 leading-6 border-t pt-3">
            {hotel.desc}
          </p>

          <div className="absolute right-9 bottom-5 pt-2 flex gap-3 justify-end">
            <button
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-lg shadow hover:bg-blue-700 focus:outline-none"
              onClick={() => navigate(`/hotels/create?hotelId=${hotel._id}`)}
            >
              Edit
            </button>
            <button
              className="px-4 py-1.5 bg-red-600 text-white text-sm rounded-lg shadow hover:bg-red-700 focus:outline-none"
              onClick={() => handleDeleteHotel(hotel._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDetails;