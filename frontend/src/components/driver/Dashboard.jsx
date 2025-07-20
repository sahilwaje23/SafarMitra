import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import theme from "../../styles/theme";

const Dashboard = ({ info }) => {
  const ridesAcceptedCnt = info?.length;
  const totalEarning = info?.reduce((acc, ride) => acc + ride.fare, 0);
  const avgRating =
    info?.reduce((acc, ride) => acc + ride.rating, 0) / ridesAcceptedCnt;

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(18, 18, 18, 0.6)"
            : "rgba(255, 255, 255, 0.6)",
        backdropFilter: "blur(10px)",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Dashboard
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="subtitle2">Rooms served</Typography>
          <Typography variant="h5">
            {ridesAcceptedCnt > 0 ? ridesAcceptedCnt : 5}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Today's Earnings</Typography>
          <Typography variant="h5">
            ₹ {totalEarning > 0 ? totalEarning : `₹ 500`}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Avg Rating recieved</Typography>
          <Typography variant="h5">{avgRating > 0 ? avgRating : 4.8}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Dashboard;
