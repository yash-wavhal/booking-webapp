import React, { useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Featured = () => {
  const { data, loading, error } = useFetch("/hotels/getallcitiescount");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-4 text-red-500">Something went wrong!</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-6 relative">
      <h2 className="text-2xl font-bold mb-3">Top Cities</h2>

      {/* Scroll buttons */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollLeft}
        aria-label="Scroll Left"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide scroll-smooth"
      >
        {data?.map((item: any) => (
          <div
            key={item.city}
            className="min-w-[250px] rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition"
            onClick={() => navigate(`/hotels/city/${encodeURIComponent(item.city)}`)}
          >
            <img
              src={
                "https://img.freepik.com/free-vector/flat-hotel-facade-background_23-2148161522.jpg?ga=GA1.1.1461544118.1750686394&semt=ais_hybrid&w=740"
              }
              alt={item.city}
              className="h-40 w-full rounded-t-lg object-cover"
            />
            <div className="p-3">
              <h3 className="text-lg font-bold">{item.city}</h3>
              <p className="text-gray-600">{item.count} properties</p>
            </div>
          </div>
        ))}

        {/* Add some right padding or empty space so last card doesn't get hidden behind button */}
        <div className="min-w-[50px]" />
      </div>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollRight}
        aria-label="Scroll Right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Featured;
