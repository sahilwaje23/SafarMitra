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
  const { sendMessage, recieveMessage, stopRecieveMessage } = useContext(SocketContext);

  console.log(entity);

  const activeAcceptedRide = entity.currentAcceptedRideId;

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
        
        if (latestEntity?.currentAcceptedRideId) {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/ride/get-ride-details?rideId=${latestEntity.currentAcceptedRideId}`,
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

  const [status, setStatus] = useState(entity.status || "OFFLINE");
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/driver/dashboard`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        });
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };
    fetchDashboard();
  }, []);
  const [incomingRequests, setIncomingRequests] = useState([]);

  useEffect(() => {
    if (status !== "ONLINE" && status !== "online") return;

    const handleNewRide = (rideData) => {
      // Ignore if the driver is already assigned to a ride
      if (entity?.currentAcceptedRideId || entity?.currentActiveRideId) {
        console.log("Ignored new ride request (already assigned):", rideData);
        return;
      }
      
      console.log("New ride received:", rideData);
      setIncomingRequests((prev) => {
        // Add new ride to the top, with a timestamp for countdown
        return [{ ...rideData, receivedAt: Date.now() }, ...prev];
      });
    };

    const handleRideExpired = (data) => {
      setIncomingRequests((prev) => prev.filter(req => (req.roomData?.id || req.roomData?._id) !== data.rideId));
    };

    console.log("Status is ONLINE. Registering socket listeners.");
    recieveMessage("new-ride", handleNewRide);
    recieveMessage("ride-expired", handleRideExpired);

    return () => {
      console.log("Cleaning up socket listeners for status:", status);
      stopRecieveMessage("new-ride", handleNewRide);
      stopRecieveMessage("ride-expired", handleRideExpired);
    };
  }, [status, entity, recieveMessage, stopRecieveMessage]);

  const isMobile = useMediaQuery("(max-width:1024px)");

  // Inlined view to prevent unmounting
  const renderMobileView = () => (
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
      <ExistingRoom incomingRequests={incomingRequests} setIncomingRequests={setIncomingRequests} />
    </Box>
  );

  const renderDesktopView = () => (
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
        <QuickActions status={status} setStatus={setStatus} />
        <Dashboard info={dashboardData} />
        {<ExistingRoom incomingRequests={incomingRequests} setIncomingRequests={setIncomingRequests} sx={{ flex: 1 }} />}
      </Box>
    </Box>
  );
  console.log("activeAcceptedRide", activeAcceptedRide);
  return (
    <>
      <div className="absolute top-20 right-4 w-[400px] z-[9999]">
        {currActRide && <ActiveRideComponent info={currActRide} />}
      </div>
      {isMobile ? renderMobileView() : renderDesktopView()}
    </>
  );
};

export default CaptainHomePage;
