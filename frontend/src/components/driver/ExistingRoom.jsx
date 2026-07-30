import React, { useState, useEffect } from "react";
import { Typography, Box, Card, Button, useMediaQuery } from "@mui/material";
import {
  LocationOn,
  AttachMoney,
  AccessTime,
  Group,
  DirectionsCar,
} from "@mui/icons-material";
import theme from "../../styles/theme";
import { useLocations } from "../../contexts/LocationsContext.jsx";
import { Link } from "react-router-dom";
import axios from "axios";
import { useRoom } from "../../contexts/RoomContext.jsx";
import { useNavigate } from "react-router-dom";

// A sub-component to handle the individual countdown and shining effect
const IncomingRideCard = ({ req, onAccept, onReject, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds countdown

  useEffect(() => {
    // Calculate how much time has already elapsed since the request was received
    const elapsed = Math.floor((Date.now() - req.receivedAt) / 1000);
    const initialTimeLeft = Math.max(15 - elapsed, 0);
    setTimeLeft(initialTimeLeft);

    if (initialTimeLeft === 0) {
      onExpire(req.roomData.id || req.roomData._id);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire(req.roomData.id || req.roomData._id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [req, onExpire]);

  return (
    <Card
      sx={{
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(18, 18, 18, 0.8)"
            : "rgba(255, 255, 255, 0.8)",
        borderRadius: "16px",
        overflow: "hidden",
        position: "relative",
        mb: 2,
        animation: "pulseGlow 2s infinite",
        border: `1px solid ${theme.palette.primaryColor.main}`,
        "@keyframes pulseGlow": {
          "0%": { boxShadow: `0 0 5px ${theme.palette.primaryColor.main}40` },
          "50%": { boxShadow: `0 0 15px ${theme.palette.primaryColor.main}80` },
          "100%": { boxShadow: `0 0 5px ${theme.palette.primaryColor.main}40` }
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.primaryColor.main }}>
            New Ride Request
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: timeLeft <= 5 ? '#f44336' : '#fff' }}>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
          <LocationOn sx={{ color: "#4caf50", mt: 0.5 }} />
          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
            <span style={{ color: "#aaa" }}>Pickup:</span> {(req.roomData.pickupAddress || req.roomData.pickup?.text)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2 }}>
          <LocationOn sx={{ color: "#f44336", mt: 0.5 }} />
          <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
            <span style={{ color: "#aaa" }}>Drop:</span> {(req.roomData.dropAddress || req.roomData.destination?.text)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, mb: 2, px: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AttachMoney sx={{ fontSize: 20, color: theme.palette.primaryColor.main }} />
            <Typography variant="body1" fontWeight="bold">₹{req.roomData.fare}</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Group sx={{ fontSize: 20, color: "text.secondary" }} />
            <Typography variant="body2">{req.roomData.pcount || 1} Person</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => onReject(req.roomData.id || req.roomData._id)}
            sx={{
              borderColor: "rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: "8px",
              "&:hover": { borderColor: "#f44336", color: "#f44336" }
            }}
          >
            Reject
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => onAccept(req.roomData.id || req.roomData._id)}
            sx={{
              bgcolor: theme.palette.primaryColor.main,
              color: "#000",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Accept
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

const ExistingRoom = ({ incomingRequests, setIncomingRequests }) => {
  const navigate = useNavigate();
  const { updateEverything } = useRoom();

  const handleAcceptRoom = async (roomId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/confirm-ride`,
        { rideId: roomId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      
      localStorage.setItem("roomid", roomId);
      updateEverything(res.data);
      
      // Navigate to the active room interface without fully refreshing the page
      navigate(`/captain-room-int?roomid=${roomId}`);

    } catch (err) {
      console.error("Error accepting ride:", err);
      alert("Error confirming ride: " + (err.response?.data?.rideError || err.response?.data?.message || err.message));
      // Remove from list if it failed (e.g. someone else took it)
      setIncomingRequests((prev) => prev.filter(req => req.roomData._id !== roomId));
    }
  };

  const handleRejectRoom = (roomId) => {
    // Manually remove from our local list
    setIncomingRequests((prev) => prev.filter(req => (req.roomData.id || req.roomData._id) !== roomId));
  };

  const handleRideExpired = (data) => {
    setIncomingRequests((prev) => prev.filter(req => (req.roomData?.id || req.roomData?._id) !== data.rideId));
  };

  const handleExpire = (roomId) => {
    setIncomingRequests((prev) => prev.filter(req => (req.roomData.id || req.roomData._id) !== roomId));
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "text.primary" }}>
        Incoming Ride Requests
      </Typography>

      {(!incomingRequests || incomingRequests.length === 0) ? (
        <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", mt: 4 }}>
          No incoming ride requests at the moment.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {incomingRequests.map((req) => (
            <IncomingRideCard
              key={req.roomData._id}
              req={req}
              onAccept={handleAcceptRoom}
              onReject={handleRejectRoom}
              onExpire={handleExpire}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ExistingRoom;
