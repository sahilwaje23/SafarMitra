import React, { useState, useEffect } from "react";
import { Paper, Typography, Box, Card, Button, useMediaQuery } from "@mui/material";
import { LocationOn, AttachMoney, AccessTime, Group, DirectionsCar } from "@mui/icons-material";
import theme from "../../styles/theme";

const Room = ({ roomData = [], inputValue = "" }) => {
  const isMobile = useMediaQuery("(max-width:1024px)");

  const [filteredRoomData, setFilteredRoomData] = useState(roomData);

  useEffect(() => {
    // Ensure roomData is an array before filtering
    if (Array.isArray(roomData)) {
      // Filter rooms based on input value
      if (inputValue.length > 0) {
        const filteredRooms = roomData.filter(
          (room) =>
            room.pickup.text.toLowerCase().includes(inputValue.toLowerCase()) ||
            room.destination.text.toLowerCase().includes(inputValue.toLowerCase())
        );
        setFilteredRoomData(filteredRooms);
      } else {
        setFilteredRoomData(roomData);
      }
    }
  }, [inputValue, roomData]);

  const handleJoinRoom = (roomId) => {
    console.log(`Joining room with ID: ${roomId}`);
  };

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === "dark" ? "rgba(18, 18, 18)" : "rgba(255, 255, 255)",
        minHeight: isMobile ? "300px" : "16rem",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        overflowY: "auto",
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
        Existing Rooms
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {Array.isArray(filteredRoomData) && filteredRoomData.length > 0 ? (
          filteredRoomData.map((room, index) => (
            <Card
              key={index}
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  #{index + 1} Room ID: {room._id.substring(0, 6)}
                </Typography>
                <Box sx={{ display: "grid", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Pickup:</strong> {room.pickup.text}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <LocationOn sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Destination:</strong> {room.destination.text}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AttachMoney sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Fare:</strong> ₹{room.fare}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DirectionsCar sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Distance:</strong> {room.distance} km
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <AccessTime sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Duration:</strong> {room.duration} mins
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Group sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      <strong>Participants:</strong> {room.mitra.length} user{room.mitra.length !== 1 && "s"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleJoinRoom(room._id)}
                sx={{
                  backgroundColor: theme.palette.primaryColor.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primaryColor.hover,
                  },
                  alignSelf: "flex-start",
                  fontWeight: "bold",
                }}
              >
                JOIN
              </Button>
            </Card>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
            No rooms available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Room;