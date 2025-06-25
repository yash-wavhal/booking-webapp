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
  const [slideNumber, setSlideNumber] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const [showAllPhotos, setShowAllPhotos] = useState<boolean>(false);

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
      {/* Image Slider Modal */}
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

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-indigo-900">{hotel.name}</h1>
            <div className="flex items-center space-x-2 mt-2 text-indigo-600 font-medium">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{hotel.address}</span>
            </div>
            <div className="mt-3 inline-block bg-green-100 text-green-800 rounded-full px-4 py-1 font-semibold shadow-inner">
              Excellent location – {hotel.distance} from center
            </div>
          </div>
          <div className="bg-indigo-100 rounded-lg p-4 text-center w-36 shadow-inner">
            <div className="font-semibold text-indigo-800 text-lg">Rating</div>
            <div className="flex justify-center mt-1 space-x-1">{renderStars(hotel.rating)}</div>
            <div className="mt-2 font-bold text-indigo-900 text-xl">{hotel.rating.toFixed(1)}</div>
          </div>
        </div>

        <p className="mt-5 text-yellow-800 font-semibold text-lg">
          Book a stay over ${hotel.cheapestPrice} and get a free airport taxi
        </p>

        {/* Photo grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {photosToShow.map((url, i) => (
            <img
              key={i}
              src={url}
              alt={`hotel photo ${i + 1}`}
              className="w-full h-40 rounded-lg cursor-pointer object-cover hover:scale-105 transition-transform shadow-md"
              onClick={() => handleOpen(i)}
            />
          ))}
        </div>

        {/* Show More / Show Less button */}
        {hotel.photos.length > PHOTOS_PREVIEW_LIMIT && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="px-6 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            >
              {showAllPhotos ? "Show Less" : `Show More (${hotel.photos.length - PHOTOS_PREVIEW_LIMIT} more)`}
            </button>
          </div>
        )}

        {/* Description & Pricing */}
        <div className="mt-10 flex flex-col md:flex-row gap-8">
          <section className="md:flex-1 space-y-4">
            <h2 className="text-3xl font-bold text-indigo-900">{hotel.title}</h2>
            <p className="text-gray-700 text-lg leading-relaxed">{hotel.desc}</p>
          </section>

          <section className="md:w-80 bg-indigo-50 rounded-lg p-6 shadow-inner flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-extrabold mb-4 text-indigo-900">Perfect for a long stay!</h3>
              <p className="text-indigo-700">
                Located in the heart of <strong>{hotel.city}</strong>, this property has an excellent location rating.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default HotelDetails;
