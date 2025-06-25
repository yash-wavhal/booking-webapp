import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import MailList from "../../components/mailList/MailList";
import Footer from "../../components/footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar,
  faXmark,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";

interface Hotel {
  name: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  desc: string;
  rating: number;
  cheapestPrice: number;
}

interface Room {
  _id: string;
  title: string;
  price: number;
  maxPeople: number;
  desc: string;
}

const Hotel = () => {
  const { hotelid } = useParams();
  const { data, loading, error } = useFetch<Hotel>(`/hotels/find/${hotelid}`);
  const { data: roomsData } = useFetch<Room[]>(`/rooms/${hotelid}`);
  const [slideNumber, setSlideNumber] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = (i: number) => {
    setSlideNumber(i);
    setOpen(true);
  };
  const handleMove = (dir: "l" | "r") => {
    if (!data?.photos) return;
    setSlideNumber((prev) =>
      dir === "l"
        ? prev === 0
          ? data.photos.length - 1
          : prev - 1
        : prev === data.photos.length - 1
        ? 0
        : prev + 1
    );
  };
  if (loading) {
    return <div className="p-10 text-center">Loading hotel details...</div>;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">Error loading hotel details</div>;
  }

  if (!data) {
    return <div className="p-10 text-center">No hotel data found</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <FontAwesomeIcon
            icon={faXmark}
            className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
            onClick={() => setOpen(false)}
          />
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="absolute left-5 text-white text-3xl cursor-pointer"
            onClick={() => handleMove("l")}
          />
          <img
            src={data.photos[slideNumber]}
            alt="hotel"
            className="max-h-[80vh] rounded-lg object-cover"
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            className="absolute right-5 text-white text-3xl cursor-pointer"
            onClick={() => handleMove("r")}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg p-6 mt-6 shadow-lg">
          <div className="flex justify-between items-start flex-col md:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{data.name}</h1>
              <div className="flex items-center text-gray-600 space-x-2 mt-2">
                <FontAwesomeIcon icon={faLocationDot} />
                <span>{data.address}</span>
              </div>
              <span className="bg-green-100 text-green-800 rounded-full p-2 mt-2 inline-block">
                Excellent location – {data.distance} from center
              </span>
            </div>
            <div className="bg-gray-100 rounded p-3 text-center mt-4 md:mt-0">
              <span className="font-bold text-gray-800">Rating</span>
              <div className="flex items-center justify-center mt-1">
                {[...Array(5).keys()].map((i) => (
                  <FontAwesomeIcon
                    key={i}
                    icon={faStar}
                    className={i < Math.round(data.rating) ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>
            </div>
          </div>

          <span className="text-yellow-800 font-medium mt-3 block">
            Book a stay over ${data.cheapestPrice} and get a free airport taxi
          </span>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            {data.photos?.map((url, i) => (
              <img
                key={i}
                onClick={() => handleOpen(i)}
                src={url}
                alt={`hotel ${i + 1}`}
                className="w-full h-40 rounded cursor-pointer hover:scale-105 transition object-cover"
              />
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-8">
            <div className="md:w-2/3 space-y-3">
              <h2 className="text-2xl font-bold text-gray-800">{data.title}</h2>
              <p className="text-gray-600 leading-relaxed">{data.desc}</p>
            </div>
            <div className="md:w-1/3 bg-gray-50 rounded p-4 flex flex-col space-y-3">
              <h1 className="text-xl font-bold">Perfect for a long stay!</h1>
              <span className="text-gray-600">
                Located in the heart of {data.city}, this property has an excellent location rating.
              </span>
              <h2 className="text-2xl font-bold text-gray-800">${data.cheapestPrice} per night</h2>
              <button className="bg-blue-600 text-white rounded-full py-3 hover:bg-blue-700">
                Reserve or Book Now!
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        {roomsData && roomsData.length > 0 && (
          <div className="bg-white rounded-lg p-6 mt-10 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800">Available Rooms</h2>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomsData.map((room) => (
                <div key={room._id} className="bg-gray-50 rounded-lg p-4 shadow hover:shadow-lg transition">
                  <h3 className="text-xl font-semibold text-gray-800">{room.title}</h3>
                  <p className="text-gray-600">{room.desc}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-gray-700">👥 Max {room.maxPeople}</span>
                    <span className="font-bold text-blue-600">${room.price}</span>
                  </div>
                  <button className="mt-3 w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">
                    Book This Room
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <MailList />
      <Footer />
    </div>
  );
};

export default Hotel;
