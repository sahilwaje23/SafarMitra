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
// import sendMessage from "../../../../backend/socket";
// this is essentially the roomcard in the room list here the joining behaviour will be defined , data should be updated and sent to the context here
const ExistingRoom = () => {
  const navigate = useNavigate();
  const {
    setPickup,
    setDestination,
    setRoomid,
    setDistance,
    setDuration,
    setFare,
    setStatus,
    setPcount,
    setCreatorData,
    setMitra,
    updateEverything,
    closedRooms,
    setClosedRooms,
    refresh,
    setRefresh,
  } = useRoom();

  
  // fetching all closed rooms
  useEffect( () => {
    const fetchRooms = async () => {
        console.log("here")
        const token = localStorage.getItem("token");
        if (!token) {
        console.error("No token found, cannot fetch rooms");
        navigate("/captain-signin");
        return;
        }
        try {   
        const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/driver/get-all-closed-rooms`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
            }
        );
        console.log("All rooms from API ", res.data); // Check what the API returns
        setClosedRooms(res.data);
        } catch (err) {
        console.error("Error fetching rooms:", err);
        alert(err);
        }
    };
    fetchRooms() ;
  } 
  ,
   []) // dependency factors


    const handleAcceptRoom = async (roomId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/confirm-ride`,
        {
            rideId: roomId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      const roomData = res.data;

      localStorage.setItem("roomid", roomId); // to get data after refresh
      console.log(roomData)
      
    //   // Add driver details to RoomContext
    //   if (roomData.driver) {
    //     // setDriverData({
    //     //   vehicleNo: roomData.driver.details?.vehicleNo || "N/A",
    //     //   driverId: roomData.driver._id || null,
    //     //   fullName: roomData.driver.fullName || "Unknown",
    //     //   mobileNo: roomData.driver.mobileNo || "Not Available",
    //     //   rating: roomData.driver.rating || "No Rating",
    //     //   socketId: roomData.driver.socket_id || null,
    //     //   profileImage: roomData.driver.docs?.profileImageUrl || "",
    //     // });

    // }
    updateEverything(roomData);
      

    //   // Update RoomContext state
    //   setPickup(roomData.pickup.text);
    //   setDestination(roomData.destination.text);
    //   setRoomid(roomData._id);
    //   setDistance(roomData.distance);
    //   setDuration(roomData.duration);
    //   setFare(roomData.fare);
    //   setStatus(roomData.status);
    //   setPcount(roomData.mitra.length);

    //   // Update creator details
    //   setCreatorData({
    //     creatorId: roomData.creatorId._id,
    //     fullName: roomData.creatorId.fullName,
    //     email: roomData.creatorId.email,
    //     mobileNo: roomData.creatorId.mobileNo,
    //     gender: roomData.creatorId.gender,
    //     rating: roomData.creatorId.rating,
    //     createdAt: roomData.creatorId.createdAt,
    //     updatedAt: roomData.creatorId.updatedAt,
    //     socketId: roomData.creatorId.socket_id,
    //     profileImage: roomData.creatorId.docs.profileImageUrl,
    //   });

    //   // Update mitra list
    //   setMitra(
    //     roomData.mitra.map((mitraObj) => ({
    //       mitraId: mitraObj.userId._id,
    //       socketId: mitraObj.userId.socket_id,
    //     }))
    //   );

      // Navigate to room-int only after state updates
      // navigate("/room-int");
      navigate(`/room-int?roomid=${roomData._id}`);
    } catch (e) {
      console.log("Failed to accept room: " + e);
    }
  };

  // const roomData = closedRooms;
  return (
    <Box className="p-4 bg-[#1a1a1a] min-h-screen">
      <Typography variant="h5" className="text-white mb-4 px-2">
        Existing Rooms :
      </Typography>

      <Box className="space-y-4">
        {Array.isArray(closedRooms) && closedRooms.length > 0 ? (
          closedRooms.map((room, index) => (
            <Card
              key={index}
              className="bg-[#2a2a2a] hover:bg-[#333333] transition-colors border-none"
            >
              <Box className="p-4">
                <Box className="flex justify-between items-start">
                  <Box className="space-y-4 flex-1">
                    <Box className="flex items-center gap-2">
                      <Typography className="text-white">
                        # {index + 1} Room ID:{" "}
                        <span className="text-yellow-500 font-mono">
                          {room._id.substring(0, 8)}
                        </span>
                      </Typography>
                    </Box>

                    <Box className="grid gap-3">
                      <Box className="flex items-center gap-3">
                        <LocationOn className="text-red-400/80" />
                        <Box>
                          <Typography className="text-white/50 text-sm">
                            Pickup:{" "}
                            <span className="text-white ml-2">
                              {room.pickup.text}
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-3">
                        <LocationOn className="text-green-400/80" />
                        <Box>
                          <Typography className="text-white/50 text-sm">
                            Destination:{" "}
                            <span className="text-white ml-2">
                              {room.destination.text}
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-3">
                        <AttachMoney className="text-white/70" />
                        <Box>
                          <Typography className="text-white/50 text-sm">
                            Fare :{" "}
                            <span className="text-white ml-2">
                              ₹ {room.fare}
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-3">
                        <DirectionsCar className="text-white/70" />
                        <Box>
                          <Typography className="text-white/50 text-sm">
                            Distance:{" "}
                            <span className="text-white ml-2">
                              {room.distance} km
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-3">
                        <AccessTime className="text-white/70" />
                        <Box>
                          <Typography className="text-white/50 text-sm">
                            Duration:{" "}
                            <span className="text-white ml-2">
                              {room.duration} mins
                            </span>
                          </Typography>
                        </Box>
                      </Box>

                      <Box className="flex items-center gap-3">
                        <Group className="text-white/70" />
                        <Box>
                          <Typography className="text-white/50 text-sm">
                            Participants:{" "}
                            <span className="text-white ml-2">
                              {room.mitra.length}{" "}
                              {room.mitra.length === 1 ? "user" : "users"}
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleAcceptRoom(room._id)}
                    className="font-semibold px-6 min-w-[100px]"
                    sx={{
                      bgcolor: theme.palette.primaryColor.main,
                      color: theme.palette.txtcol,
                      "&:hover": {
                        bgcolor: theme.palette.primaryColor.hover,
                      },
                    }}
                  >
                    Accept
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Card className="bg-[#2a2a2a] p-6">
            <Typography className="text-white text-center">
              No rooms available. 
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default ExistingRoom;
