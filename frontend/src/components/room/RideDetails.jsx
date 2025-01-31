import React from "react";
import { Typography, Paper } from "@mui/material";
import theme from "../../styles/theme";
function RideDetails() {
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          bgcolor: "background.paper",
          p: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Driver Details
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Journey Details
        </Typography>
      </Paper>
    </>
  );
}

export default RideDetails;
