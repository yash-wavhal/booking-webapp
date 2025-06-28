import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faStar as faStarSolid,
  faStarHalfAlt,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faStar as faStarRegular,
} from "@fortawesome/free-solid-svg-icons";

interface HotelDetailsProps {
  hotel: {
    name: string;
    city: string;
    address: string;
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

  const photosToShow = showAllPhotos
    ? hotel.photos
    : hotel.photos.slice(0, PHOTOS_PREVIEW_LIMIT);

  const handleOpen = (i: number) => {
    setSlideNumber(i);
    setOpen(true);
  };

  const handleMove = (dir: "l" | "r") => {
    setSlideNumber((prev) =>
      dir === "l"
        ? prev === 0
          ? hotel.photos.length - 1
          : prev - 1
        : prev === hotel.photos.length - 1
        ? 0
        : prev + 1
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={"full" + i}
          icon={faStarSolid}
          className="text-yellow-500"
        />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarHalfAlt}
          className="text-yellow-500"
        />
      );
    }
    while (stars.length < 5) {
      stars.push(
        <FontAwesomeIcon
          key={"empty" + stars.length}
          icon={faStarRegular}
          className="text-gray-300"
        />
      );
    }
    return stars;
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <FontAwesomeIcon
            icon={faXmark}
            className="absolute top-6 right-6 text-white text-4xl cursor-pointer hover:text-red-400 transition"
            onClick={() => setOpen(false)}
          />
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="absolute left-6 text-white text-4xl cursor-pointer hover:text-gray-300 transition"
            onClick={() => handleMove("l")}
          />
          <img
            src={hotel.photos[slideNumber]}
            alt={`hotel image ${slideNumber + 1}`}
            className="max-h-[80vh] max-w-full rounded-lg shadow-lg object-cover mx-auto"
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            className="absolute right-6 text-white text-4xl cursor-pointer hover:text-gray-300 transition"
            onClick={() => handleMove("r")}
          />
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-7xl mx-auto my-10">
        <div className="relative w-full h-[400px]">
          <img
            src={hotel.photos[0] || "/demo_hotel_image.avif"}
            alt="Main hotel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6">
            <h1 className="text-white text-4xl font-extrabold drop-shadow-lg">
              {hotel.name}
            </h1>
            <div className="text-white mt-1 font-medium flex items-center space-x-2">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>
                {hotel.address} • {hotel.city}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Summary Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="inline-block bg-green-100 text-green-800 rounded-full px-4 py-1 font-semibold">
                Excellent location – {hotel.distance} from center
              </div>
              <p className="mt-3 text-indigo-700 text-lg font-medium">
                Book over <strong>${hotel.cheapestPrice}</strong> & get a free
                airport taxi!
              </p>
            </div>
            <div className="bg-indigo-100 rounded-lg p-5 text-center w-48 shadow">
              <p className="text-indigo-800 font-bold text-lg">Rating</p>
              <div className="flex justify-center mt-1 space-x-1">
                {renderStars(hotel.rating)}
              </div>
              <p className="text-indigo-900 text-2xl font-extrabold mt-2">
                {hotel.rating.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photosToShow && photosToShow.length > 0 ? (
              photosToShow.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`hotel photo ${i + 1}`}
                  className="rounded-xl h-40 w-full object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => handleOpen(i)}
                />
              ))
            ) : (
              <img
                src="/demo_hotel_image.avif"
                alt="default hotel"
                className="rounded-xl h-40 w-full object-cover shadow-md"
              />
            )}
          </div>

          {/* Show More / Less */}
          {hotel.photos.length > PHOTOS_PREVIEW_LIMIT && (
            <div className="text-center">
              <button
                onClick={() => setShowAllPhotos(!showAllPhotos)}
                className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              >
                {showAllPhotos
                  ? "Show Less"
                  : `Show More (${
                      hotel.photos.length - PHOTOS_PREVIEW_LIMIT
                    } more)`}
              </button>
            </div>
          )}

          {/* Description Section */}
          <div className="flex flex-col md:flex-row gap-10">
            <div className="md:flex-1 space-y-4">
              <h2 className="text-3xl font-bold text-indigo-900">
                {hotel.title}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {hotel.desc}
              </p>
            </div>

            <div className="md:w-80 bg-indigo-50 rounded-2xl p-6 flex flex-col justify-between shadow-inner">
              <h3 className="text-xl font-bold mb-2 text-indigo-900">
                Perfect for a long stay!
              </h3>
              <p className="text-indigo-700">
                Located in <strong>{hotel.city}</strong>, this hotel has a top
                location score!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDetails;
