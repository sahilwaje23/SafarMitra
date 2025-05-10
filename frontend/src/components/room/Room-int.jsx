<<<<<<< HEAD
// - modes for room are `unconfirmed,locked,accepted,running,finished`
// - suggested to use numbers to represent statuses enables for efficient communication as in the frontend corresponding to the number we display that particular status
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useMediaQuery ,Paper,GlobalStyles} from '@mui/material';
import Map from '../map/Map';
import Chat from './Chat'
import Popup from './Popup';
import theme from '../../styles/theme';
import RideDetails from './RideDetails'
const ButtonGroup = ({ activeTab, setActiveTab }) => {
 return(
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button
      onClick={() => setActiveTab('details')}
      sx={{
        bgcolor: activeTab === 'details' ? theme.palette.primaryColor.main : 'transparent',
        color: activeTab === 'details' ? theme.palette.txtcol : theme.palette.primaryColor.main,
        border: `1px solid ${theme.palette.primaryColor.main}`,
        py: 1.5,
        px:4,
        borderRadius: '1rem',
        fontWeight: 'bold',
        outline: 'none', // Removes the focus outline
        '&:hover': {
          bgcolor: activeTab === 'details' ? theme.palette.primaryColor.hover : 'rgba(254, 196, 0, 0.1)',
        },
      }}
    >
      Ride Details
    </Button>
    <Button
      onClick={() => setActiveTab('chat')}
      sx={{
        bgcolor: activeTab === 'chat' ? theme.palette.primaryColor.main : 'transparent',
        color: activeTab === 'chat' ? theme.palette.txtcol : theme.palette.primaryColor.main,
        border: `1px solid ${theme.palette.primaryColor.main}`,
        py: 1.5,
        px:4,
        borderRadius: '1rem',
        outline: 'none', // Removes the focus outline
        fontWeight: 'bold',
        '&:hover': {
          bgcolor: activeTab === 'chat' ? theme.palette.primaryColor.hover : 'rgba(254, 196, 0, 0.1)',
        },
      }}
    >
      Chat
    </Button>
  </Box>
=======
// - modes for room are unconfirmed,locked,accepted,running,finished
// - suggested to use numbers to represent statuses enables for efficient communication as in the frontend corresponding to the number we display that particular status
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
import axios from "axios";
import { LocationContext, useLocations } from "../../contexts/LocationsContext";
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
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
  );
};

const MobileView = () => {
<<<<<<< HEAD
  return (
    <>
    <GlobalStyles styles={{ body: { overflowX: 'hidden' } }} />
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      //  position: 'relative',
      //  border:'1px solid red'
      }}
    >
      <Map />
      <Box sx={{
        // border:'1em solid hotpink',
        pb:'0.4rem',
        // mb:'1rem',
        // height:'32px',
        }}>
      <Popup />
      </Box>
    </Box>
=======
  const { pickupLat, pickupLng, dropLat, dropLng, pickupText, dropText } =
    useLocations();
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
          <Popup />
        </Box>
      </Box>
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
    </>
  );
};

<<<<<<< HEAD

function DesktopView() {
  const [activeTab, setActiveTab] = useState('details');
  const [status, setStatus] = useState('unconfirmed');
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '85vh',
      width: '99%',
      marginLeft:'0.1rem',
      margin: '0.5rem' ,// For navbar
      //border:'1rem solid hotpink',
      gap:'0.4rem'
    }}>
      <Box sx={{ flex: '60%', height: '90%',
        //border:'1px solid aqua',
        width:'70%',
       }}>
        <Map />
      </Box>
      <Paper sx={{
        flex: '40%',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        //border:'1px solid red',
        padding:'0.5rem',
        //paddingRight:'7rem',
        width:'90%',
        height:'100%',
        
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3 ,
          marginRight:'0.8rem',
          gap:3,
          
        }}>
=======
function DesktopView() {
  const [activeTab, setActiveTab] = useState("details");
  const [status, setStatus] = useState("unconfirmed");
  const { pickupLat, pickupLng, dropLat, dropLng, pickupText, dropText } =
    useLocations();
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
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
          <ButtonGroup activeTab={activeTab} setActiveTab={setActiveTab} />
          <Typography sx={{ color: theme.palette.primaryColor.main }}>
            Status : {status}
          </Typography>
        </Box>
<<<<<<< HEAD
        {activeTab === 'chat' ? (
            <Box
=======
        {activeTab === "chat" ? (
          <Box
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
            sx={{
              height: "75%", // Control height of the chat container
              maxHeight: "75%", // Max height, you can adjust this as needed
              overflowY: "auto", // Make it scrollable if content overflows
            }}
          >
            <Chat />
          </Box>
<<<<<<< HEAD
          ) : (
            <>
             <Typography sx={{ mb: 1,marginLeft:'1rem' }}>
               Source : <span style={{ color: theme.palette.primaryColor.main }}>DADAR STN</span>
             </Typography>
             <Typography sx={{ mb: 2,marginLeft:'1rem' }}>
               Destination : <span style={{ color: theme.palette.primaryColor.main }}>VJTI</span>
             </Typography>
         <RideDetails/>
            </>  
=======
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
                {pickupText}
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
                {dropText}
              </Box>
            </Typography>
            <div className="overflow-y-auto ">
              <RideDetails />
            </div>
          </>
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
        )}
      </Paper>
    </Box>
  );
}

function RoomInt() {
<<<<<<< HEAD
  const isMobile = useMediaQuery('(max-width:1024px)');
=======
  const isMobile = useMediaQuery("(max-width:1024px)");
  const { sendMessage, recieveMessage } = useContext(SocketContext);
  const { entity } = useContext(EntityContext);
  // useEffect(() => {
  //   sendMessage("join", { userType: "USER", userId });

  //   recieveMessage("confirm-ride", (rideData) => {
  //     // ^ Chaitanya whatever new ride is confirmed by driver u will get data here
  //     console.log("Ride Confirmed", rideData);
  //   });

  //   recieveMessage("user-joined", (rideData) => {
  //     // ^ Chaitanya whenever a new user joins a ride u will get data here
  //     console.log("New User Joined", rideData);
  //   });

  //   recieveMessage("new-userJoin", (rideData) => {
  //     // ^ Chaitanya whenever a new user joins a ride u will get data here
  //     console.log("New User Joined", rideData);
  //   });

  //   recieveMessage("new-chat", ({ msg, name }) => {
  //     console.log("Message Received: " + msg + " " + name);
  //    });
  //   }, []);

>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
  return isMobile ? <MobileView /> : <DesktopView />;
}

export default RoomInt;