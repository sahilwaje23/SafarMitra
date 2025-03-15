// - the lifecycle flows as open -> closed -> accepted -> ongoing -> completed
// whatever time u are going to join or create room basdically all the information this interface uses is derrived from room context only 
// everyone puts info to context , context provides info to all via this room interface only 

import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  Paper,
  GlobalStyles,
} from "@mui/material";
import Map from "../map/Map";
import Chat from "./Chat";
import Popup from "./Popup";
import theme from "../../styles/theme";
import RideDetails from "./RideDetails";
import { SocketContext } from "../../contexts/Socket";
import { EntityContext } from "../../contexts/EntityContext";
import { useRoom } from "../../contexts/RoomContext";
const ButtonGroup = ({ activeTab, setActiveTab }) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        onClick={() => setActiveTab("details")}
        sx={{
          bgcolor: activeTab === "details"
            ? theme.palette.primaryColor.main
            : "transparent",
          color: activeTab === "details"
            ? theme.palette.txtcol
            : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: "1rem",
          fontWeight: "bold",
          outline: "none",
          "&:hover": {
            bgcolor: activeTab === "details"
              ? theme.palette.primaryColor.hover
              : "rgba(254, 196, 0, 0.1)",
          },
        }}
      >
        Ride Details
      </Button>

      <Button
        onClick={() => setActiveTab("chat")}
        sx={{
          bgcolor: activeTab === "chat"
            ? theme.palette.primaryColor.main
            : "transparent",
          color: activeTab === "chat"
            ? theme.palette.txtcol
            : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: "1rem",
          outline: "none",
          fontWeight: "bold",
          "&:hover": {
            bgcolor: activeTab === "chat"
              ? theme.palette.primaryColor.hover
              : "rgba(254, 196, 0, 0.1)",
          },
        }}
      >
        Chat
      </Button>
    </Box>
  );
};

const MobileView = () => {

  return (
    <>
      <GlobalStyles styles={{ body: { overflowX: "hidden" } }} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          //  position: 'relative',
          //  border:'1px solid red'
        }}
      >
        <Map />
        <Box
          sx={{
            // border:'1em solid hotpink',
            pb: "0.4rem",
            // mb:'1rem',
            // height:'32px',
          }}
        >
          {/* this popup card contains all the info for particular room for mobile view hence context is directly refered there not that popup wont have all values as further values are distrubuted to RideDetails.jsx which is basically just the Room interface data like information about the drivers creator and mitras their information and other information about the ride */}
          <Popup />
        </Box>
      </Box>
    </>
  );
};

function DesktopView({ roomIntData }) {
  const [activeTab, setActiveTab] = useState("details");
  const {
    pickup,
    destination,
    status,
  } = useRoom();
  return (
    <Box
      sx={{
        display: "flex",
        height: "85vh",
        width: "99%",
        marginLeft: "0.1rem",
        margin: "0.5rem", // For navbar
        //border:'1rem solid hotpink',
        gap: "0.4rem",
      }}
    >
      <Box
        sx={{
          flex: "60%",
          height: "90%",
          //border:'1px solid aqua',
          width: "70%",
        }}
      >
        <Map />
      </Box>
      <Paper
        sx={{
          flex: "40%",
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(18, 18, 18, 0.6)"
              : "rgba(255, 255, 255, 0.6)",
          display: "flex",
          flexDirection: "column",
          //border:'1px solid red',
          padding: "0.5rem",
          //paddingRight:'7rem',
          width: "90%",
          height: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            marginRight: "0.8rem",
            gap: 3,
          }}
        >
          <ButtonGroup activeTab={activeTab} setActiveTab={setActiveTab} />
          <Typography sx={{ color: theme.palette.primaryColor.main }}>
            Status : {status}
          </Typography>
        </Box>
        {activeTab === "chat" ? (
          <Box
            sx={{
              height: "75%", // Control height of the chat container
              maxHeight: "75%", // Max height, you can adjust this as needed
              overflowY: "auto", // Make it scrollable if content overflows
            }}
          >
            <Chat />
          </Box>
        ) : (
          <>
            <Typography
              sx={{
                mb: 1,
                marginLeft: "1rem",
                '& span': {
                  color: theme.palette.secondaryColor.main
                }
              }}
            >
              Source:{" "}
              <Box component="span">
                {pickup || "CSMT"}
              </Box>
            </Typography>

            <Typography
              sx={{
                mb: 2,
                marginLeft: "1rem",
                '& span': {
                  color: theme.palette.secondaryColor.main
                }
              }}
            >
              Destination:{" "}
              <Box component="span">
                {destination || "Kalyan"}
              </Box>
            </Typography>
            <div className="overflow-y-auto ">
              <RideDetails />
            </div>
          </>
        )}
      </Paper>
    </Box>
  );
}

function RoomInt() {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const { sendMessage, recieveMessage } = useContext(SocketContext);
  const { entity } = useContext(EntityContext);
  const userId =
    entity.data?._id || JSON.parse(localStorage.getItem("USER"))._id;
  const roomIntData = useRoom();
  console.log(userId, "userId");

  useEffect(() => {
    // make object here rideData dependency of this useeffect
    sendMessage("join", { userType: "USER", userId });

    recieveMessage("confirm-ride", (rideData) => {
      // ^ Chaitanya whatever new ride is confirmed by driver u will get data here
      console.log("Ride Confirmed", rideData);
    });

    recieveMessage("new-userJoin", (rideData) => {
      // ^ Chaitanya whenever a new user joins a ride u will get data here
      console.log("New User Joined", rideData);
    });

    recieveMessage("new-chat", ({ msg, name }) => {
      console.log("Message Received: " + msg + " " + name);
    });

    return () => {

    };
  }, []);

  return isMobile ? <MobileView /> : <DesktopView roomIntData={roomIntData} />;
}

export default RoomInt;
