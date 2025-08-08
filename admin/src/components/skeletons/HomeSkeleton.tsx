// components/CityCardSkeleton.tsx
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

const CityCardSkeleton = () => {
  return (
    <Card
      sx={{
        minWidth: 300,
        minHeight: 400,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 250,
          backgroundColor: "#e0e0e0",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      />
      <CardContent>
        <Typography
          variant="h5"
          sx={{ backgroundColor: "#e0e0e0", width: "60%", height: 24, mb: 1 }}
        />
        <Typography
          variant="h6"
          sx={{ backgroundColor: "#e0e0e0", width: "80%", height: 20, mb: 1 }}
        />
        <Typography
          variant="body2"
          sx={{ backgroundColor: "#e0e0e0", width: "90%", height: 16 }}
        />
      </CardContent>
    </Card>
  );
};

export default CityCardSkeleton;