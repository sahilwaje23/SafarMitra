import React, { useContext, useEffect, useState } from "react";
import { Box, useMediaQuery, Snackbar, Alert, Typography, Dialog, Button } from "@mui/material";
import QuickActions from "./QuickActions"; // Assuming the component is renamed without 'Captain'
import Dashboard from "./Dashboard"; // Assuming the component is renamed without 'Captain'
import Map from "../map/Map";
import Room from "../room/Room";
import theme from "../../styles/theme.js"; // Correct relative path for styles folder
import { EntityContext } from "../../contexts/EntityContext";
import { SocketContext } from "../../contexts/Socket";
import { Socket } from "socket.io-client";
import RoomPopup from "./RoomPopup.jsx";
import ExistingRoom from "./ExistingRoom.jsx";
import { useRoom } from "../../contexts/RoomContext.jsx";
import ActiveRideComponent from "../user/ActiveRideComponent.jsx";
import axios from "axios";

const CaptainHomePage = () => {
  const { setClosedRooms } = useRoom();
  const { entity } = useContext(EntityContext);
  const driverId =
    entity._id || JSON.parse(localStorage.getItem("DRIVER"))?._id;
  const { sendMessage, recieveMessage } = useContext(SocketContext);

  console.log(entity);

  const activeAcceptedRide = entity.currAcceptedRide;

  const [currActRide, setCurrActRide] = useState(null);

  useEffect(() => {
    const refreshProfileAndRide = async () => {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/driver/my-profile`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            withCredentials: true,
          }
        );
        const latestEntity = profileRes.data;
        
        if (latestEntity?.currAcceptedRide) {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/ride/get-ride-details?rideId=${latestEntity.currAcceptedRide}`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
              withCredentials: true,
            }
          );
          setCurrActRide(response.data);
        }
      } catch (error) {
        console.error("Error refreshing active ride:", error);
      }
    };
    refreshProfileAndRide();
  }, []);

  // ^ Chaitanya ithe status online asel tr pratyek 10 sec la update hoil location
  const [status, setStatus] = useState("online");
  const [newRidePopup, setNewRidePopup] = useState(null);

  const handleCloseNewRidePopup = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setNewRidePopup(null);
  };

  const handleAcceptRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const rideId = newRidePopup?.roomData?._id;
      if (!rideId) return;

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/confirm-ride`,
        { rideId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200) {
        setNewRidePopup(null);
        window.location.href = `/captain-room-int?roomid=${rideId}`;
      }
    } catch (err) {
      console.error(err);
      alert("Error confirming ride: " + (err.response?.data?.message || err.message));
    }
  };

  // online offline status
  useEffect(() => {
    if (status === "online") {
      recieveMessage("new-ride", (rideData) => {
        // ^ Chaitanya whatever new ride Data comes u will recieve it here {roomDetail , creatorDetail}
        // setRefresh( (prev) => !prev);
        console.log("New ride received:", rideData);
        setNewRidePopup(rideData);
      });
    }
  }, [status]);

  const isMobile = useMediaQuery("(max-width:1024px)");

  const MobileView = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        // height: "400px",
        minHeight: "100vh",
        pb: "64px", // Account for bottom navigation
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(18, 18, 18, 0.3)"
            : "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      <QuickActions />
      <Dashboard />
      <div className="h-[400px]">
        <Map />
      </div>
      {/* <RoomPopup/> */}
      <ExistingRoom />
    </Box>
  );

  const DesktopView = () => (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 0.5,
        height: "100vh",
        pt: "0.4rem", // Account for top navigation
        bgcolor:
          theme.palette.mode === "dark"
            ? "rgba(18, 18, 18, 0.3)"
            : "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left Section - Map Only */}
      <Box
        sx={{
          flex: 2,
          //overflow: 'auto'
          height: "100%",
          // border: '0.5rem outset pink',
        }}
      >
        <Map
          sx={{
            position: "absolute", // Add this
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: "0.5rem outset green",
            height: "100vh",
            width: "100vw",
          }}
        />
      </Box>

      {/* Right Section - Actions, Dashboard, Room */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flex: 1,
          overflow: "auto",
        }}
      >
        <QuickActions />
        <Dashboard />
        {<ExistingRoom sx={{ flex: 1 }} />}
      </Box>
    </Box>
  );
  console.log("activeAcceptedRide", activeAcceptedRide);
  return (
    <>
      <div className="absolute z-10">
        {currActRide && <ActiveRideComponent info={currActRide} />}
      </div>
      {isMobile ? <MobileView /> : <DesktopView />}
      
      {/* New Ride Popup */}
      <Dialog 
        open={Boolean(newRidePopup)} 
        onClose={handleCloseNewRidePopup}
        PaperProps={{ style: { borderRadius: 16, background: 'linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 100%)' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: theme.palette.primaryColor.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">🔔</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.primaryColor.main, mb: 1 }}>
            New Ride Request!
          </Typography>
          
          <Box sx={{ background: 'rgba(255,255,255,0.05)', p: 2, borderRadius: 2, border: '1px dashed rgba(255,255,255,0.2)', textAlign: 'left', mt: 3, mb: 3 }}>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
              <strong style={{ color: theme.palette.primaryColor.main }}>From:</strong> {newRidePopup?.roomData?.pickup?.text || 'Unknown'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc', mb: 1 }}>
              <strong style={{ color: theme.palette.primaryColor.main }}>To:</strong> {newRidePopup?.roomData?.destination?.text || 'Unknown'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>
              <strong style={{ color: theme.palette.primaryColor.main }}>Passengers:</strong> {newRidePopup?.roomData?.pcount || 1}
            </Typography>
          </Box>
          
          <Button variant="contained" fullWidth onClick={handleAcceptRide} sx={{ bgcolor: theme.palette.primaryColor.main, color: '#000', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}>
            Accept Ride
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default CaptainHomePage;
