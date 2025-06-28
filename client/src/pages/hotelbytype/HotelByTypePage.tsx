import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

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

function HotelByTypePage() {
  const { type } = useParams();
  const navigate = useNavigate();

  const { data: hotels, loading, error } = useFetch<Hotel[]>(`/hotels/type/${type}`);
//   console.log(hotels);

  const capitalize = (str: string = "") =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (loading) return <div className="p-10 text-center">Loading hotels...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load hotels.</div>;
  if (!hotels || hotels.length === 0)
    return <div className="p-10 text-center">No {type} type hotels found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-indigo-900 mb-6">
        {capitalize(type)}-type Hotels
      </h1>

      {hotels.map((hotel) => (
        <div
          key={hotel._id}
          className="bg-white rounded-2xl shadow-black shadow-sm flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition duration-300"
        >
          <img
            src={hotel.photos?.[0] || "/demo_hotel_image.avif"}
            alt={hotel.name}
            className="w-full md:w-72 h-60 object-cover"
          />

          <div className="flex-1 p-6 space-y-3 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold text-indigo-800">{hotel.name}</h2>
              <p className="text-gray-600 text-sm">
                {hotel.address}, {hotel.city}
              </p>
              <p className="text-green-700 font-medium">
                {hotel.distance} from city center
              </p>
              <p className="text-gray-700 text-sm mt-2">{hotel.title}</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 pt-4 border-t">
              <div>
                <p className="text-yellow-600 font-semibold text-sm">
                  Rating: {hotel.rating !== undefined && hotel.rating !== null ? hotel.rating.toFixed(1) : "N/A"}
                </p>
                <p className="text-gray-500 text-xs">
                  {hotel.bookingsCount} bookings
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-indigo-900">
                  ${hotel.cheapestPrice}
                </p>
                <p className="text-xs text-gray-500">per night</p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/hotels/${hotel._id}`)}
              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              View Hotel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HotelByTypePage;
