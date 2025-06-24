import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PropertyType {
  type: string;
  count: number;
}

const PropertyList: React.FC = () => {
  const { data, loading, error } = useFetch<PropertyType[]>(
    "/hotels/countByType"
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const images = [
    "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg",
  ];

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">Error loading data</div>
    );
  }

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  return (
    <div className="max-w-6xl mx-auto my-6 relative">
      <h2 className="text-2xl font-bold mb-3">Explore Property Types</h2>

      {/* Left Button */}
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow z-10 hover:bg-gray-100"
        onClick={scrollLeft}
        aria-label="Scroll Left"
      >
        <FaChevronLeft />
      </button>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide"
      >
        {loading ? (
          <div>Loading, please wait...</div>
        ) : (
          data?.map((item, i) => (
            <div
              key={i}
              className="min-w-[250px] rounded-lg shadow-lg cursor-pointer hover:scale-105 transform transition"
              onClick={() =>
                navigate(`/hotels/type/${encodeURIComponent(item.type)}`)
              }
            >
              <img
                src={images[i] || images[0]}
                alt={item.type}
                className="h-40 w-full rounded-t-lg object-cover"
              />
              <div className="p-3">
                <h3 className="text-lg font-bold">{item.type}</h3>
                <p className="text-gray-600">
                  {item.count} {item.type}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Right Button */}
      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow z-10 hover:bg-gray-100"
        onClick={scrollRight}
        aria-label="Scroll Right"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PropertyList;
