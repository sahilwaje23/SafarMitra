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
  TextField,
  Dialog,
  Snackbar,
  Alert
} from "@mui/material";
import Map from "../map/Map";
import Chat from "../room/Chat";
import Popup from "../room/Popup";
import theme from "../../styles/theme";
import RideDetails from "../room/RideDetails";
import { SocketContext } from "../../contexts/Socket";
import { EntityContext } from "../../contexts/EntityContext";
import { useRoom } from "../../contexts/RoomContext";
import { useLocations } from "../../contexts/LocationsContext";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { calculateETA } from "../../utils/eta";

const handleEndRide = async (rideId) => {
  const token = localStorage.getItem("token");

  if (!rideId || !token) {
    alert("roomid ID or Token not found");
    return;
  }
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/ride/end-ride`,
      { rideId: rideId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    console.log("Ride ended successfully:", response.data);
  } catch (error) {
    console.error("Error ending ride:", error);
    alert("Error ending ride: " + error.message);
  }
};

const ButtonGroup = ({ activeTab, setActiveTab }) => {
  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Button
        onClick={() => setActiveTab("details")}
        sx={{
          bgcolor:
            activeTab === "details"
              ? theme.palette.primaryColor.main
              : "transparent",
          color:
            activeTab === "details"
              ? theme.palette.txtcol
              : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: "1rem",
          fontWeight: "bold",
          outline: "none",
          "&:hover": {
            bgcolor:
              activeTab === "details"
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
          bgcolor:
            activeTab === "chat"
              ? theme.palette.primaryColor.main
              : "transparent",
          color:
            activeTab === "chat"
              ? theme.palette.txtcol
              : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: "1rem",
          outline: "none",
          fontWeight: "bold",
          "&:hover": {
            bgcolor:
              activeTab === "chat"
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

const DriverControls = () => {
  const { status, fare } = useRoom();
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("roomid");
  const [rideEndedPopup, setRideEndedPopup] = useState(false);

  const onStartRide = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/start-ride`,
        { rideId, otp },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      // Wait for socket to update room context or manually refresh
      window.location.reload(); 
    } catch (err) {
      alert("Error starting ride: " + (err.response?.data?.rideError || err.message));
    }
  };

  const onEndRide = async () => {
    await handleEndRide(rideId);
    setRideEndedPopup(true);
  };

  const handleCancelRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/driver-cancel-ride`,
        { rideId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        alert("You have cancelled the ride.");
        window.location.href = "/captain-homepage";
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling ride: " + (err.response?.data?.rideError || err.message));
    }
  };

  return (
    <>
      {status === 'accepted' && (
        <Box sx={{ p: 2, mb: 2, mt: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 2, border: `1px solid ${theme.palette.primaryColor.main}` }}>
          <Typography variant="h6" sx={{ color: theme.palette.primaryColor.main, mb: 1, fontWeight: 'bold' }}>
            Start Trip
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#ccc' }}>
            Enter the secure OTP provided by the passenger.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
              size="small" 
              placeholder="4-digit OTP" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              sx={{ flex: 1, input: { color: 'white' }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } } }}
            />
            <Button variant="contained" onClick={onStartRide} sx={{ bgcolor: '#4caf50', fontWeight: 'bold', color: '#fff' }}>
              Verify & Start
            </Button>
          </Box>
          <Button variant="outlined" onClick={handleCancelRide} sx={{ mt: 2, borderColor: 'red', color: 'red', width: '100%', '&:hover': { bgcolor: 'rgba(255, 0, 0, 0.1)', borderColor: 'red' } }}>
            Cancel Ride
          </Button>
        </Box>
      )}

      {status === 'ongoing' && (
        <Box sx={{ p: 2, mb: 2, mt: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 2, border: '1px solid #f44336' }}>
          <Typography variant="h6" sx={{ color: '#f44336', mb: 1, fontWeight: 'bold' }}>
            Trip in Progress
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, color: '#ccc' }}>
            Drive safely to the destination.
          </Typography>
          <Button variant="contained" fullWidth onClick={onEndRide} sx={{ bgcolor: '#f44336', fontWeight: 'bold', color: '#fff', py: 1.5, borderRadius: 2 }}>
            End Ride
          </Button>
        </Box>
      )}

      {/* Ride Ended Popup for Driver */}
      <Dialog 
        open={rideEndedPopup} 
        onClose={() => setRideEndedPopup(false)}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: theme.palette.primaryColor.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">💰</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.primaryColor.main, mb: 2 }}>
            Trip Completed!
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
            Please Collect Cash
          </Typography>
          <Typography variant="h2" fontWeight="bold" sx={{ color: '#4caf50', my: 2 }}>
            ₹{fare || "0"}
          </Typography>
          <Button variant="contained" fullWidth onClick={() => { setRideEndedPopup(false); window.location.href = "/captain-homepage"; }} sx={{ bgcolor: theme.palette.primaryColor.main, color: '#000', fontWeight: 'bold', mt: 2, py: 1.5, borderRadius: 2 }}>
            Confirm & Exit
          </Button>
        </Box>
      </Dialog>

    </>
  );
};

const MobileView = () => {
  const { creatorData } = useRoom();
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
          {/* Driver specific action controls for start/end ride */}
          <Box sx={{ px: 2 }}>
            <DriverControls />
          </Box>
          <Popup />
        </Box>
      </Box>
    </>
  );
};

function DesktopView({ roomIntData }) {
  const [activeTab, setActiveTab] = useState("details");
  const { pickup, destination, status } = useRoom();
  const { driverLocation, currentLocation, pickupLat, pickupLng, dropLat, dropLng } = useLocations();
  const [expandedPickup, setExpandedPickup] = useState(false);
  const [expandedDrop, setExpandedDrop] = useState(false);

  let dynamicEtaText = "";
  if (status === "accepted") {
    const lat1 = driverLocation?.lat || currentLocation?.[0];
    const lng1 = driverLocation?.lng || currentLocation?.[1];
    const eta = calculateETA(lat1, lng1, pickupLat, pickupLng);
    dynamicEtaText = `Pickup in ${eta} mins`;
  } else if (status === "ongoing") {
    const lat1 = driverLocation?.lat || currentLocation?.[0];
    const lng1 = driverLocation?.lng || currentLocation?.[1];
    const eta = calculateETA(lat1, lng1, dropLat, dropLng);
    dynamicEtaText = `Drop in ${eta} mins`;
  }
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
          <Typography sx={{ color: theme.palette.primaryColor.main, fontWeight: 'bold' }}>
            {status === "accepted" && dynamicEtaText}
            {status === "ongoing" && dynamicEtaText}
            {status === "completed" && "Trip Completed"}
          </Typography>
        </Box>
        <DriverControls />
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
                "& span": {
                  color: theme.palette.secondaryColor.main,
                  cursor: 'pointer',
                  display: expandedPickup ? 'block' : '-webkit-box',
                  WebkitLineClamp: expandedPickup ? 'none' : 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }}
              onClick={() => setExpandedPickup(!expandedPickup)}
            >
              Source: <Box component="span">{pickup || "CSMT"}</Box>
            </Typography>

            <Typography
              sx={{
                mb: 2,
                marginLeft: "1rem",
                "& span": {
                  color: theme.palette.secondaryColor.main,
                  cursor: 'pointer',
                  display: expandedDrop ? 'block' : '-webkit-box',
                  WebkitLineClamp: expandedDrop ? 'none' : 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }}
              onClick={() => setExpandedDrop(!expandedDrop)}
            >
              Destination: <Box component="span">{destination || "Kalyan"}</Box>
            </Typography>
            <div className="overflow-y-auto ">
              <RideDetails isDriverView={true} />
            </div>
          </>
        )}
      </Paper>
    </Box>
  );
}

function RoomIntDriver() {
  const { creatorData } = useRoom();
  const [isMobile, setIsMobile] = useState(
    window.matchMedia("(max-width: 768px)").matches
  );

  const [chatNotification, setChatNotification] = useState({ open: false, message: "" });
  const [creatorCancelledPopup, setCreatorCancelledPopup] = useState(false);
  const { sendMessage, recieveMessage, stopRecieveMessage } = useContext(SocketContext);
  const roomIntData = useRoom();
  const { setMessages } = roomIntData;

  useEffect(() => {
    recieveMessage("new-chat", (data) => {
      setChatNotification({ open: true, message: `New message from ${data.senderName}` });
      setMessages((prev) => {
        const newMsgs = [...prev, data];
        sessionStorage.setItem(`messages_${roomIntData.roomid}`, JSON.stringify(newMsgs));
        return newMsgs;
      });
    });
  }, [recieveMessage, roomIntData.roomid, setMessages]);
  const { entity } = useContext(EntityContext);
  const driverId = entity._id || JSON.parse(localStorage.getItem("DRIVER"))?._id || JSON.parse(localStorage.getItem("USER"))?._id;
  const [searchParams] = useSearchParams();
  const { updateEverything } = useRoom();
  const { setPickupLat, setPickupLng, setPickupText, setDropLat, setDropLng, setDropText, setDriverLocation } = useLocations();
  const rideId = searchParams.get("roomid");

  const fetchRideDetails = async () => {
    const token = localStorage.getItem("token");

    if (!rideId || !token) {
      alert("roomid ID or Token not found");
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/ride/get-ride-details?rideId=${rideId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      );

      const rideData = response.data;
      console.log("Ride Data: ", rideData);
      updateEverything(rideData);

      // Also update LocationsContext so the Map knows where to draw the route/ETA
      if (rideData?.pickup?.lat) {
        setPickupLat(rideData.pickup.lat);
        setPickupLng(rideData.pickup.lng);
        setPickupText(rideData.pickup.text);
      }
      if (rideData?.destination?.lat) {
        setDropLat(rideData.destination.lat);
        setDropLng(rideData.destination.lng);
        setDropText(rideData.destination.text);
      }
      if (rideData?.driver?.location?.ltd && rideData?.driver?.location?.lng) {
        setDriverLocation({
          lat: rideData.driver.location.ltd,
          lng: rideData.driver.location.lng,
        });
      }
    } catch (err) {
      console.log(err);
      alert("Error: " + err.message);
    }
  };

  /*
  useEffect(() => {
    // make object here rideData dependency of this useeffect
    // whenever ride data updates u will not only do these socket updates but also reflect them in ui
    sendMessage("join", { userType: "USER", userId });

    recieveMessage("confirm-ride", (rideData) => {
      // ^ Chaitanya whatever new ride is confirmed by driver u will get data here
      console.log("Ride Confirmed", rideData);
    });

    recieveMessage("new-userJoin", (rideData) => {
      // ^ Chaitanya whatever new USER JOINS u will get data here

      alert("New User Joined", rideData.user.fullName);
      // console.log(rideData.user.fullName);

      setMitra((prev) => [
        ...prev,
        {
          fullName: rideData.user.fullName || "CAKALALA",
          rating: rideData.user.rating || null,
          gender: rideData.user.gender || null,
          mobileNo: rideData.user.mobileNo || null,
          email: rideData.user.email || null,
          socketId: rideData.user.socket_id || null,
          docs: {
            profileImage: rideData.user.docs?.profileImageUrl || null,
          },
        },
      ]);
    });

    recieveMessage("new-chat", ({ msg, name }) => {
      console.log("Message Received: " + msg + " " + name);
    });

    return () => {};
  }, []);
  */

  useEffect(() => {
    sendMessage("ride:join", {
      rideId,
    });
    console.log("should run only once...")

    const handleRideCancelled = (data) => {
      console.log("Ride cancelled:", data);
      setCreatorCancelledPopup(true);
    };

    recieveMessage("ride-cancelled", handleRideCancelled);

    return () => {
      if (stopRecieveMessage) {
        stopRecieveMessage("ride-cancelled", handleRideCancelled);
      }
    };
  }, []);

  useEffect(() => {
    // ^ 15-03-25 : Ye refresh handle karne ka logic hai , isse dont touch

    // ^ IMP : wanted to discuss about it :
    // if (!pickup) {
    //   fetchRideDetails();
    // }

    fetchRideDetails();
  }, []);

  return (
    <>
      {isMobile ? <MobileView /> : <DesktopView roomIntData={roomIntData} />}
      <Snackbar
        open={chatNotification.open}
        autoHideDuration={4000}
        onClose={() => setChatNotification({ ...chatNotification, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%', mt: 8 }}>
          {chatNotification.message}
        </Alert>
      </Snackbar>

      <Dialog 
        open={creatorCancelledPopup} 
        onClose={() => { setCreatorCancelledPopup(false); window.location.href = "/captain-homepage"; }}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">⚠️</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#f44336', mb: 2 }}>
            Ride Cancelled
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            The passenger has cancelled this ride.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => { setCreatorCancelledPopup(false); window.location.href = "/captain-homepage"; }} sx={{ bgcolor: theme.palette.primaryColor.main, color: '#000', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}>
            Go to Home
          </Button>
        </Box>
      </Dialog>
    </>
  );
}

export default RoomIntDriver;
