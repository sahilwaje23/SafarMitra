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

const CaptainHomePage = () => {
  const { entity } = useContext(EntityContext);
  const driverId =
    entity.data?._id || JSON.parse(localStorage.getItem("DRIVER"))._id;
  const { sendMessage, recieveMessage } = useContext(SocketContext);

  // ^ Chaitanya ithe status online asel tr pratyek 10 sec la update hoil location
  const [status, setStatus] = useState("online");

  useEffect(() => {
    sendMessage("join", { userType: "DRIVER", userId: driverId });
  }, []);

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
        height: "90vh",
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
      <Map />
      <Room />
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
            // position: 'absolute', // Add this
            // top: 0,
            // left: 0,
            // right: 0,
            // bottom: 0,
            // border: '0.5rem outset green',
            height: "auto",
            width: "100%",
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
        <Room sx={{ flex: 1 }} />
      </Box>
    </Box>
  );

  return <>{isMobile ? <MobileView /> : <DesktopView />}</>;
};

export default CaptainHomePage;
