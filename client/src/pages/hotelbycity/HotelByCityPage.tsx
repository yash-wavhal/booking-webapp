import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import HotelList from "../../components/hotelList/HotelList";

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

const HotelByCityPage = () => {
  const { city } = useParams();
  const {
    data: hotels,
    loading,
    error,
  } = useFetch<Hotel[]>(`/hotels/hotelsbycityname/${city}`);
  const navigate = useNavigate();

  const capitalize = (str: string = "") =>
    str.charAt(0).toUpperCase() + str.slice(1);

  if (loading) return <div className="p-10 text-center">Loading hotels...</div>;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load hotels.
      </div>
    );
  if (!hotels || hotels.length === 0)
    return <div className="p-10 text-center">No hotels found in {city}</div>;

  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-indigo-900 mb-6">
          Hotels in {capitalize(city)}
        </h1>
        {hotels.map((hotel) => (
          <HotelList hotel={hotel} citytype={hotel.city} />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default HotelByCityPage;
