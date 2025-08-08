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

interface HotelDetailModalProps {
  selectedHotel: Hotel;
  onView: () => void;
  onCancel: () => void;
  onUnsave?: (hotelId: string) => void;
  isProfile: boolean;
}

const HotelDetailModal = ({
  selectedHotel,
  onView,
  onCancel,
  onUnsave,
  isProfile,
}: HotelDetailModalProps) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6 relative animate-fadeIn">
        <h3 className="text-2xl font-bold text-indigo-800 mb-2">
          {selectedHotel.name}
        </h3>

        <img
          src={
            selectedHotel.photos?.[0] ||
            "https://via.placeholder.com/600x400.png?text=No+Image"
          }
          alt={selectedHotel.name}
          className="w-full h-52 object-cover rounded-lg mb-4"
        />

        <div className="text-sm text-gray-700 space-y-1">
          <p className="font-semibold text-gray-900">{selectedHotel.desc}</p>
          <p>
            <span className="font-semibold text-gray-900">City:</span>{" "}
            {selectedHotel.city}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Address:</span>{" "}
            {selectedHotel.address}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Distance:</span>{" "}
            {selectedHotel.distance}
          </p>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            Close
          </button>
          {isProfile && onUnsave && (
            <button
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              onClick={() => onUnsave(selectedHotel._id)}
            >
              Unsave Hotel
            </button>
          )}
          <button
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
            onClick={onView}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailModal;