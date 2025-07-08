import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/navbar/Navbar";

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
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          {capitalize(type).toUpperCase()}-TYPE HOTELS
        </h1>

        {hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 flex flex-col md:flex-row overflow-hidden border border-gray-200"
          >
            {/* Hotel Image */}
            <div className="md:w-[240px] w-full h-[200px] md:h-auto overflow-hidden">
              <img
                src={hotel.photos?.[0] || "/demo_hotel_image.avif"}
                alt={hotel.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* Hotel Details */}
            <div className="flex-1 p-6 flex flex-col justify-between gap-2">
              <div className="space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-800">
                    {hotel.name}
                  </h2>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-[2px] rounded-full font-medium whitespace-nowrap">
                    {type}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{hotel.address}, {hotel.city}</p>

                <p className="text-sm text-gray-800 font-semibold pt-1">{hotel.title}</p>
                <p className="text-sm text-gray-700">{hotel.desc}</p>
                <p className="text-sm text-green-700 font-medium">{hotel.distance}</p>
              </div>

              {/* Rating and Button */}
              <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-md text-yellow-600 font-medium">Rating</span>
                  <span className="bg-yellow-500 text-white font-bold px-2 py-1 text-sm rounded">
                    {hotel.rating !== undefined && hotel.rating !== null
                      ? hotel.rating.toFixed(1)
                      : "N/A"}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                  className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  View Details
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default HotelByTypePage;
