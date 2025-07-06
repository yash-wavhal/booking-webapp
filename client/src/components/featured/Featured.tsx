import React, { useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";
import CityCardSkeleton from "../skeletons/HomeSkeleton";

const Featured = () => {
  const { data, loading, error } = useFetch("/hotels/getallcitiescount");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  if (error)
    return (
      <div className="text-center p-4 text-red-500">Something went wrong!</div>
    );

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* <h2 className="text-3xl text-gray-900 font-bold ml-4 mb-3">TOP CITIES</h2> */}

      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollLeft}
      >
        <ChevronLeft className="w-6 h-6" />
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
        {(loading ? Array(4).fill(null) : Array.isArray(data) ? data : []).map((item: any, index: number) =>
            loading ? (
              <CityCardSkeleton key={index} />
            ) : (
              <Card
                key={item.city}
                sx={{
                  minWidth: 300,
                  minHeight: 400,
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate(`/hotels/city/${encodeURIComponent(item.city)}`)
                }
                className="hover:scale-105 transform transition"
              >
                <CardMedia
                  component="img"
                  image="https://img.freepik.com/free-vector/flat-hotel-facade-background_23-2148161522.jpg"
                  alt={item.city}
                  sx={{
                    height: 250,
                    objectFit: "cover",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <CardContent>
                  <Typography variant="h5">{item.city}</Typography>
                  <Typography variant="h6" color="text.secondary">
                    {item.count} properties available
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {item.desc || "Beautiful destination."}
                  </Typography>
                </CardContent>
              </Card>
            )
        )}
      </Box>

      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollRight}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Featured;