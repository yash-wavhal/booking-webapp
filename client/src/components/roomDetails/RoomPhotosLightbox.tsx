import { useState } from "react";
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface RoomPhotosLightboxProps {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

const RoomPhotosLightbox = ({
  photos,
  initialIndex,
  onClose,
}: RoomPhotosLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prevPhoto = () => {
    setCurrentIndex((i) => (i === 0 ? photos.length - 1 : i - 1));
  };

  const nextPhoto = () => {
    setCurrentIndex((i) => (i === photos.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
      <FaTimes
        className="absolute top-6 right-6 text-white text-4xl cursor-pointer hover:text-red-400 transition"
        onClick={onClose}
      />
      <FaChevronLeft
        className="absolute left-6 text-white text-4xl cursor-pointer hover:text-gray-300 transition"
        onClick={prevPhoto}
      />
      <img
        src={photos[currentIndex]}
        alt={`Room photo ${currentIndex + 1}`}
        className="max-h-[80vh] max-w-full rounded-lg shadow-lg object-contain mx-auto"
      />
      <FaChevronRight
        className="absolute right-6 text-white text-4xl cursor-pointer hover:text-gray-300 transition"
        onClick={nextPhoto}
      />
    </div>
  );
};

export default RoomPhotosLightbox;