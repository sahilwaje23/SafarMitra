import React, { useContext, useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
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
  const { yogesh } = useRoom();
  const { entity } = useContext(EntityContext);
  const driverId =
    entity._id || JSON.parse(localStorage.getItem("DRIVER"))?._id;
  const { sendMessage, recieveMessage } = useContext(SocketContext);

  console.log(entity);

  const activeAcceptedRide = entity.currAcceptedRide;

  const [currActRide, setCurrActRide] = useState(null);

  useEffect(() => {
    if (activeAcceptedRide) {
      const fetchRideDetails = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/ride/get-ride-details?rideId=${
              entity.currAcceptedRide
            }`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );
          console.log("Ride details:", response.data);
          localStorage.setItem("roomid", activeAcceptedRide);
          setCurrActRide(response.data);
        } catch (error) {
          console.error("Error fetching ride details:", error);
        }
      };
      fetchRideDetails();
    }
  }, []);

  // ^ Chaitanya ithe status online asel tr pratyek 10 sec la update hoil location
  const [status, setStatus] = useState("online");

  useEffect(() => {
    sendMessage("join", { userType: "DRIVER", userId: driverId });
  }, []);

  // online offline status
  useEffect(() => {
    if (status === "online") {
      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) =>
            sendMessage("update-location-driver", {
              driverId,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            })
          );
        }
      };

      recieveMessage("new-ride", (rideData) => {
        // ^ Chaitanya whatever new ride Data comes u will recieve it here {roomDetail , creatorDetail}
        // setRefresh( (prev) => !prev);
        console.log("New ride received:", rideData);
      });

      const locationInterval = setInterval(updateLocation, 15000);
      updateLocation();

      return () => clearInterval(locationInterval);
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
        {activeAcceptedRide && <ActiveRideComponent info={currActRide} />}
      </div>

      {isMobile ? <MobileView /> : <DesktopView />}
    </>
  );
};

export default CaptainHomePage;
