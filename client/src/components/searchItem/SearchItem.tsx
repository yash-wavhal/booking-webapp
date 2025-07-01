import { useNavigate } from "react-router-dom";

interface SearchItemProps {
  hotel: {
    _id: string;
    name: string;
    city: string;
    type: string;
    address: string;
    distance: string;
    photos: string[];
    title: string;
    desc: string;
    rating?: number;
    cheapestPrice: number;
    bookingsCount?: number;
  };
}

const SearchItem: React.FC<SearchItemProps> = ({ hotel }) => {
  const navigate = useNavigate();
  return (
    <div className="border border-gray-300 p-4 rounded-md flex justify-between gap-5 mb-5 shadow-sm">
      {/* Image */}
      <img
        src={hotel.photos?.[0] || "/default-hotel.jpg"}
        alt={hotel.name}
        className="w-[200px] h-[200px] object-cover rounded-md"
      />

      {/* Description */}
      <div className="flex flex-col gap-2 flex-[2]">
        <h1 className="text-xl text-blue-700 font-semibold">{hotel.name}</h1>
        <span className="text-xs text-gray-700">{hotel.distance}</span>
        <span className="text-xs bg-green-700 text-white w-fit px-2 py-[2px] rounded-md">
          {hotel.type}
        </span>
        <span className="text-xs font-bold text-gray-800">{hotel.title}</span>
        <span className="text-xs text-gray-700">{hotel.desc}</span>
        <span className="text-xs font-bold text-green-700">Free cancellation</span>
        <span className="text-xs text-green-700">
          You can cancel later, so lock in this great price today!
        </span>
      </div>

      {/* Right Details */}
      <div className="flex flex-col justify-between flex-1 text-right">
        {hotel.rating && (
          <div className="flex justify-end items-center gap-2">
            <span className="font-medium">Excellent</span>
            <button className="bg-blue-900 text-white px-2 py-[2px] font-bold text-sm rounded">
              {hotel.rating.toFixed(1)}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-1 items-end">
          {/* <span className="text-2xl font-semibold">₹{hotel.cheapestPrice}</span> */}
          <span className="text-xs text-gray-500">Includes taxes and fees</span>
          <button onClick={() => {
                  navigate(`/hotels/${hotel._id}`);
                }} className="bg-blue-700 text-white font-bold px-3 py-2 rounded hover:bg-blue-800 transition">
            See availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;