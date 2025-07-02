import React, { useRef } from "react";
import useFetch from "../../hooks/useFetch";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Box, Card, CardMedia, CardContent, Typography } from "@mui/material";

const Featured = () => {
  const { data, loading, error } = useFetch("/hotels/getallcitiescount");
  // console.log(data);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -1000, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 1000, behavior: "smooth" });

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error)
    return (
      <div className="text-center p-4 text-red-500">Something went wrong!</div>
    );

  return (
    <div className="max-w-7xl mx-auto my-6 relative">
      <h2 className="text-3xl text-gray-900 font-bold ml-4 mb-3">TOP CITIES</h2>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollLeft}
      >
        <FaChevronLeft />
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
        {data?.map((item: any) => (
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
              image="https://img.freepik.com/free-vector/flat-hotel-facade-background_23-2148161522.jpg?ga=GA1.1.1461544118.1750686394&semt=ais_hybrid&w=740"
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
        ))}
      </Box>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow z-10"
        onClick={scrollRight}
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Featured;
