import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import CityCardSkeleton from "../skeletons/HomeSkeleton";

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

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  const images = [
    "https://cf.bstatic.com/xdata/images/xphoto/square300/57584488.webp?k=bf724e4e9b9b75480bbe7fc675460a089ba6414fe4693b83ea3fdd8e938832a6&o=",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-apartments_300/9f60235dc09a3ac3f0a93adbc901c61ecd1ce72e.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/bg_resorts/6f87c6143fbd51a0bb5d15ca3b9cf84211ab0884.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-villas_300/dd0d7f8202676306a661aa4f0cf1ffab31286211.jpg",
    "https://cf.bstatic.com/static/img/theme-index/carousel_320x240/card-image-chalet_300/8ee014fcc493cb3334e25893a1dee8c6d36ed0ba.jpg",
  ];

  if (error)
    return (
      <div className="text-center p-4 text-red-500">Error loading data</div>
    );

  return (
    <div className="max-w-7xl mx-auto relative mb-10">
      {/* <h2 className="text-3xl text-gray-900 font-bold ml-4 mb-3">
        EXPLORE PROPERTY TYPES
      </h2> */}
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollLeft}
        aria-label="Scroll Left"
      >
        <ChevronLeft />
      </button>
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          overflowX: "auto",
          gap: 2,
          p: 2,
          scrollbarWidth: "none",
        }}
      >
        {(loading ? Array(4).fill(null) : Array.isArray(data) ? data : []).map((item, i) =>
          loading ? (
            <CityCardSkeleton key={i} />
          ) : (
            <Card
              key={i}
              sx={{
                minWidth: 300,
                minHeight: 400,
                borderRadius: 2,
                boxShadow: 3,
                cursor: "pointer",
              }}
              onClick={() =>
                navigate(`/hotels/type/${encodeURIComponent(item.type)}`)
              }
              className="hover:scale-105 transform transition"
            >
              <CardMedia
                component="img"
                image={images[i] || images[0]}
                alt={item.type}
                sx={{ height: 250, objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6">{item.type}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.count} {item.type}
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Box>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollRight}
        aria-label="Scroll Right"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default PropertyList;
