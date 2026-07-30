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
  CircularProgress,
  Snackbar,
  Alert,
  Dialog
} from "@mui/material";
import Map from "../map/Map";
import Chat from "./Chat";
import Popup from "./Popup";
import theme from "../../styles/theme";
import RideDetails from "./RideDetails";
import { SocketContext } from "../../contexts/Socket";
import { EntityContext } from "../../contexts/EntityContext";
import { useRoom } from "../../contexts/RoomContext";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useLocations } from "../../contexts/LocationsContext";
import { calculateETA } from "../../utils/eta";

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

const MobileView = () => {
  const { updateEverything, setMitraCopy, messages, setMessages, creatorData, roomid, status, setStatus, isSearching, setIsSearching } = useRoom();
  const { entity } = useContext(EntityContext);
  const userId = entity?.id || entity?._id || JSON.parse(localStorage.getItem("USER"))?.id || JSON.parse(localStorage.getItem("USER"))?._id;
  const isCreator = userId === creatorData?.creatorId;

  const handleAssignDriver = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/close-room`,
        { roomId: roomid },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        setStatus("closed");
        setIsSearching(true);
        alert("Driver assigning initiated!");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/user-cancel-ride`,
        { rideId: roomid },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        alert("Ride cancelled successfully.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling ride: " + (err.response?.data?.rideError || err.message));
    }
  };

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
          <Popup
            isCreator={isCreator}
            handleAssignDriver={handleAssignDriver}
            handleCancelRide={handleCancelRide}
            status={status}
            isSearching={isSearching}
          />
        </Box>
      </Box>
    </>
  );
};

function DesktopView({ roomIntData }) {
  const [activeTab, setActiveTab] = useState("details");
  const { pickup, destination, status, roomid, creatorData, setStatus, isSearching, setIsSearching } =
    useRoom();
  const { driverLocation, currentLocation, pickupLat, pickupLng, dropLat, dropLng } = useLocations();

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
  const { entity } = useContext(EntityContext);
  const userId = entity?.id || entity?._id || JSON.parse(localStorage.getItem("USER"))?.id || JSON.parse(localStorage.getItem("USER"))?._id;
  const isCreator = userId === creatorData?.creatorId;

  const handleAssignDriver = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("rideId", roomid);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/close-room`,
        { roomId: roomid },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        setStatus("closed");
        setIsSearching(true);
        alert("Driver assigning initiated!");
      }
    } catch (err) {
      console.error(err);
      alert("Error: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCancelRide = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/user-cancel-ride`,
        { rideId: roomid },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.status === 200) {
        alert("Ride cancelled successfully.");
      }
    } catch (err) {
      console.error(err);
      alert("Error cancelling ride: " + (err.response?.data?.rideError || err.message));
    }
  };

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              sx={{
                color: theme.palette.primaryColor.main,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {status === "open" && "Status : Open"}
              {status === "closed" && isSearching && "Searching for driver..."}
              {status === "closed" && !isSearching && "Status : Closed"}
              {status === "accepted" && dynamicEtaText}
              {status === "ongoing" && dynamicEtaText}
              {status === "completed" && "Journey completed"}
            </Typography>
            {status === "accepted" && roomIntData?.otp && (
              <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', px: 2, py: 0.5, borderRadius: 1, border: `1px solid ${theme.palette.primaryColor.main}` }}>
                <Typography variant="body2" sx={{ color: theme.palette.txtcol, fontWeight: 'bold' }}>
                  OTP: <span style={{ color: theme.palette.primaryColor.main, letterSpacing: 2 }}>{roomIntData.otp}</span>
                </Typography>
              </Box>
            )}
            {isCreator && (status === "open" || status === "closed") && (
              <Button
                variant="contained"
                onClick={handleAssignDriver}
                sx={{
                  bgcolor: theme.palette.primaryColor.main,
                  color: theme.palette.txtcol,
                  "&:hover": {
                    bgcolor: theme.palette.primaryColor.hover,
                  },
                }}
              >
                {status === "closed" ? "Retry Assign Driver" : "Assign Driver"}
              </Button>
            )}
            {isCreator && (status === "open" || status === "closed" || status === "accepted") && (
              <Button
                variant="outlined"
                onClick={handleCancelRide}
                sx={{
                  borderColor: 'red',
                  color: 'red',
                  "&:hover": {
                    bgcolor: 'rgba(255, 0, 0, 0.1)',
                    borderColor: 'red',
                  },
                }}
              >
                Cancel Ride
              </Button>
            )}
          </Box>
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
                "& span": {
                  color: theme.palette.secondaryColor.main,
                },
              }}
            >
              Source: <Box component="span">{pickup || "CSMT"}</Box>
            </Typography>

            <Typography
              sx={{
                mb: 2,
                marginLeft: "1rem",
                "& span": {
                  color: theme.palette.secondaryColor.main,
                },
              }}
            >
              Destination: <Box component="span">{destination || "Kalyan"}</Box>
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

const RoomInt = () => {
  const { creatorData } = useRoom();
  const { entity } = useContext(EntityContext);
  const userId = entity?.id || entity?._id || JSON.parse(localStorage.getItem("USER"))?.id || JSON.parse(localStorage.getItem("USER"))?._id;
  const isCreator = userId === creatorData?.creatorId;

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { recieveMessage, stopRecieveMessage, sendMessage } =
    useContext(SocketContext);
  const roomIntData = useRoom();
  const { setDriverLocation, setPickupLat, setPickupLng, setPickupText, setDropLat, setDropLng, setDropText, resetLocationContext } = useLocations();

  const { pickup, destination, updateEverything, setMitra, setStatus, messages, setMessages, setIsSearching, setDriverData, setOtp } =
    useRoom();

  const [chatNotification, setChatNotification] = useState({ open: false, message: "" });

  useEffect(() => {
    const handleIncomingChat = (data) => {
      setChatNotification({ open: true, message: `New message from ${data.senderName}` });
      setMessages((prev) => {
        const newMsgs = [...prev, data];
        sessionStorage.setItem(`messages_${roomIntData.roomid}`, JSON.stringify(newMsgs));
        return newMsgs;
      });
    };

    recieveMessage("new-chat", handleIncomingChat);

    return () => {
      if (stopRecieveMessage) {
        stopRecieveMessage("new-chat", handleIncomingChat);
      }
    };
  }, [recieveMessage, stopRecieveMessage, roomIntData.roomid, setMessages]);

  const [mitraCopy, setMitraCopy] = useState([]);
  const [rideStartedPopup, setRideStartedPopup] = useState(false);
  const [rideEndedPopup, setRideEndedPopup] = useState(null);
  const [rideAcceptedPopup, setRideAcceptedPopup] = useState(false);
  const [rideNotFoundPopup, setRideNotFoundPopup] = useState(false);
  const [rideCancelledPopup, setRideCancelledPopup] = useState(null);
  const [isValidRoom, setIsValidRoom] = useState(true);
  const [errorSnackbar, setErrorSnackbar] = useState({ open: false, message: "" });

  useEffect(() => {
    recieveMessage("confirm-ride", (rideData) => {
      setRideAcceptedPopup(true);
      // optionally could fetch ride details again
    });
  }, [recieveMessage]);

  const fetchRideDetails = async () => {
    const rideId = searchParams.get("roomid");
    // alert(rideId);
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

      //^ Chaitanya here is the rideData object
      const rideData = response.data;
      // alert("Ride Data: " + JSON.stringify(rideData));
      console.log("Ride Data: ", rideData);
      
      if (!rideData) {
        throw new Error("Room not found or no longer exists");
      }

      updateEverything(rideData);
      setMitraCopy((rideData.mitras || rideData.mitra || []).map((m) => ({ ...m })));
      console.log("Mitra Copy: ", mitraCopy);

      // Also update LocationsContext so the Map knows where to draw the route/ETA
      if (rideData?.pickup?.lat) {
        setPickupLat(rideData.pickup.lat);
        setPickupLng(rideData.pickup.lng);
        setPickupText(rideData.pickupAddress || rideData.pickup?.text);
      }
      if (rideData?.destination?.lat) {
        setDropLat(rideData.destination.lat);
        setDropLng(rideData.destination.lng);
        setDropText(rideData.dropAddress || rideData.destination?.text);
      }
      if (rideData?.driver?.location?.ltd && rideData?.driver?.location?.lng) {
        setDriverLocation({
          lat: rideData.driver.location.ltd,
          lng: rideData.driver.location.lng,
        });
      }

    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.rideError || err.message;
      setErrorSnackbar({ open: true, message: "Error: " + errMsg });
      setIsValidRoom(false);
    }
  };

  const handleRetrySearchApi = async () => {
    const rideId = searchParams.get("roomid");
    const token = localStorage.getItem("token");
    if (!rideId || !token) return;

    try {
      setRideNotFoundPopup(false);
      setStatus("closed");
      setIsSearching(true);
      
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/close-room`,
        { roomId: rideId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      
      console.log("Retry response:", response.data);
      alert("Searching for drivers again...");
    } catch (err) {
      console.error(err);
      alert("Error retrying search: " + (err.response?.data?.rideError || err.message));
    }
  };

  // console.log("creator data : ", creatorData);
  useEffect(() => {
    console.log("The creator  data is : ", creatorData);

    // ^ commenting below lines 15-03-25
    // const storedUser = localStorage.getItem("USER");
    // console.log("Raw USER data from localStorage:", storedUser);
  }, [creatorData]);

  useEffect(() => {
    // make object here rideData dependency of this useeffect
    // whenever ride data updates u will not only do these socket updates but also reflect them in ui

    const rideId = searchParams.get("roomid");
    sendMessage("ride:join", {
      rideId,
    });

    const handleConfirmRide = (rideData) => {
      // ^ Chaitanya whatever new ride is confirmed by driver u will get data here
      console.log("Ride Confirmed by driver", rideData);
      
      if (rideData?.ride) {
        updateEverything(rideData.ride);
      }

      const driverLat = rideData?.driver?.location?.ltd;
      const driverLng = rideData?.driver?.location?.lng;
      const pLat = rideData?.ride?.pickup?.lat;
      const pLng = rideData?.ride?.pickup?.lng;
      let eta = 5; // fallback
      if (driverLat && driverLng && pLat && pLng) {
        eta = calculateETA(driverLat, driverLng, pLat, pLng);
      }
      // driverAssignedPopup logic removed
    };

    const handleNewUserJoin = (rideData) => {
      alert("New User Joined: " + rideData.user.fullName);
      if (rideData.room) {
        updateEverything(rideData.room);
      }
    };

    const handleRideEnded = (rideData) => {
      console.log("Ride ended:", rideData);
      setRideEndedPopup(rideData);
    };

    const handleRideStarted = (rideData) => {
      console.log("Ride started:", rideData);
      if (rideData) {
        updateEverything(rideData);
      }
      setRideStartedPopup(true);
    };

    const handleNewChat = (data) => {
      console.log("Message Received: ", data);
    };

    const handleRoomClosed = (roomData) => {
      setStatus("closed");
      setIsSearching(true);
      const roomCreatorId = roomData?.creatorId?.id || roomData?.creatorId?._id || roomData?.creatorId;
      if (roomCreatorId !== userId) {
        alert("Driver assignment has been initiated!");
      }
    };

    const handleDriverLocation = (driverLocation) => {
      console.log("Driver Location received: ", driverLocation);
      if (driverLocation?.ltd && driverLocation?.lng) {
        setDriverLocation({
          lat: driverLocation.ltd,
          lng: driverLocation.lng
        });
      }
    };

    const handleRideNotFound = (data) => {
      console.log("Ride not found:", data);
      setRideNotFoundPopup(true);
      setIsSearching(false);
      setStatus("closed");
    };

    const handleRideCancelled = (data) => {
      console.log("Ride cancelled:", data);
      setRideCancelledPopup(data.message || "The ride has been cancelled.");
    };

    const handleDriverCancelledRedispatch = (data) => {
      console.log("Driver cancelled, searching again:", data);
      alert(data.message || "Driver cancelled. Searching for a new driver...");
      setStatus("closed");
      setIsSearching(true);
      setOtp(null);
      setDriverData({
        vehicleNo: null,
        driverId: null,
        fullName: null,
        mobileNo: null,
        rating: null,
        socketId: null,
        profileImage: null,
      });
      // Ride will be redispatched automatically by the backend
    };

    recieveMessage("confirm-ride", handleConfirmRide);
    recieveMessage("new-userJoin", handleNewUserJoin);
    recieveMessage("ride-ended", handleRideEnded);
    recieveMessage("ride-started", handleRideStarted);
    recieveMessage("new-chat", handleNewChat);
    recieveMessage("room-closed", handleRoomClosed);
    recieveMessage("update-location-driver", handleDriverLocation);
    recieveMessage("ride-not-found", handleRideNotFound);
    recieveMessage("ride-cancelled", handleRideCancelled);
    recieveMessage("driver-cancelled-redispatch", handleDriverCancelledRedispatch);

    return () => {
      if (stopRecieveMessage) {
        stopRecieveMessage("confirm-ride", handleConfirmRide);
        stopRecieveMessage("new-userJoin", handleNewUserJoin);
        stopRecieveMessage("ride-ended", handleRideEnded);
        stopRecieveMessage("ride-started", handleRideStarted);
        stopRecieveMessage("new-chat", handleNewChat);
        stopRecieveMessage("room-closed", handleRoomClosed);
        stopRecieveMessage("ride-not-found", handleRideNotFound);
        stopRecieveMessage("ride-cancelled", handleRideCancelled);
        stopRecieveMessage("driver-cancelled-redispatch", handleDriverCancelledRedispatch);
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
      {!isValidRoom ? (
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#121212' }}>
          <Typography color="white">Room does not exist or access denied.</Typography>
        </Box>
      ) : (
        isMobile ? <MobileView /> : <DesktopView roomIntData={roomIntData} />
      )}

      <Snackbar
        open={errorSnackbar.open}
        autoHideDuration={6000}
        onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setErrorSnackbar({ ...errorSnackbar, open: false })} severity="error" sx={{ width: '100%' }}>
          {errorSnackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Driver Assigned & OTP Popup Removed */}

      {/* Ride Started Popup */}
      <Dialog 
        open={rideStartedPopup} 
        onClose={() => setRideStartedPopup(false)}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#4caf50', mb: 2 }}>
            Journey Started!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            Your OTP has been verified and your trip has begun. Sit back, relax, and enjoy the ride!
          </Typography>
          <Button variant="contained" fullWidth onClick={() => setRideStartedPopup(false)} sx={{ bgcolor: '#4caf50', color: '#fff', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}>
            Awesome
          </Button>
        </Box>
      </Dialog>

      {/* Ride Ended Popup */}
      <Dialog 
        open={Boolean(rideEndedPopup)} 
        onClose={() => setRideEndedPopup(null)}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: theme.palette.primaryColor.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">🏁</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.primaryColor.main, mb: 2 }}>
            You've Arrived!
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, color: 'rgba(255,255,255,0.7)' }}>
            Total Fare to Pay
          </Typography>
          <Typography variant="h2" fontWeight="bold" sx={{ color: '#4caf50', my: 2 }}>
            ₹{rideEndedPopup?.ride?.fare || "0"}
          </Typography>
          <Button variant="contained" fullWidth onClick={() => { setRideEndedPopup(null); resetLocationContext(); window.location.href = "/user-homepage"; }} sx={{ bgcolor: theme.palette.primaryColor.main, color: '#000', fontWeight: 'bold', mt: 2, py: 1.5, borderRadius: 2 }}>
            Pay & Complete
          </Button>
        </Box>
      </Dialog>
      
      {/* Ride Accepted Popup */}
      <Dialog 
        open={rideAcceptedPopup} 
        onClose={() => setRideAcceptedPopup(false)}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: theme.palette.primaryColor.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">🚕</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.palette.primaryColor.main, mb: 2 }}>
            Ride Confirmed!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            A captain has accepted your ride and is on their way.
          </Typography>
          <Button variant="contained" fullWidth onClick={() => { setRideAcceptedPopup(false); fetchRideDetails(); }} sx={{ bgcolor: theme.palette.primaryColor.main, color: '#000', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}>
            View Details
          </Button>
        </Box>
      </Dialog>

      {/* Ride Not Found Popup */}
      <Dialog 
        open={rideNotFoundPopup} 
        onClose={() => setRideNotFoundPopup(false)}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">⚠️</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#f44336', mb: 2 }}>
            No Drivers Found
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            No drivers were available for your ride. {isCreator ? "Would you like to retry?" : "Please wait for the creator to retry or cancel."}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => setRideNotFoundPopup(false)} sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', py: 1.5, borderRadius: 2 }}>
              Close
            </Button>
            {isCreator && (
              <Button variant="contained" fullWidth onClick={handleRetrySearchApi} sx={{ bgcolor: theme.palette.primaryColor.main, color: '#000', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}>
                Retry
              </Button>
            )}
          </Box>
        </Box>
      </Dialog>

      {/* Ride Cancelled Popup */}
      <Dialog 
        open={Boolean(rideCancelledPopup)} 
        onClose={() => {}}
        PaperProps={{ style: { borderRadius: 16, background: '#1e1e1e' } }}
      >
        <Box sx={{ p: 4, textAlign: 'center', color: 'white', minWidth: '300px' }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '50%', background: '#f44336', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h4">🚫</Typography>
            </Box>
          </Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#f44336', mb: 2 }}>
            Ride Cancelled
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'rgba(255,255,255,0.8)' }}>
            {rideCancelledPopup}
          </Typography>
          <Button variant="contained" fullWidth onClick={() => { setRideCancelledPopup(null); resetLocationContext(); setStatus("cancelled"); navigate("/user-homepage"); }} sx={{ bgcolor: '#f44336', color: '#fff', fontWeight: 'bold', py: 1.5, borderRadius: 2 }}>
            Back to Home
          </Button>
        </Box>
      </Dialog>

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
    </>
  );
}

export default RoomInt;
