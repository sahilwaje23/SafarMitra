import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import theme from "../../styles/theme";

const Dashboard = ({ info }) => {
  const ridesAcceptedCnt = info?.ridesAcceptedCnt || 0;
  const totalEarning = info?.totalEarning || 0;
  const avgRating = 4.8; // Defaulting to 4.8 as rating isn't aggregated yet

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
            {ridesAcceptedCnt}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Today's Earnings</Typography>
          <Typography variant="h5">
            ₹ {totalEarning}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Avg Rating recieved</Typography>
          <Typography variant="h5">{avgRating}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Dashboard;
