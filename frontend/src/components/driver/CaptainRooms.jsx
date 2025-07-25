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
const Room = ({ roomData = [] }) => {
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
  } = useRoom();

  // const handleJoinRoom = async (roomId) => {
  //   try {
  //     const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/join-room?roomId=${roomId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //       withCredentials: true,
  //     });
  //     console.log(res);
  //   } catch (e) {
  //     alert(e);
  //   }
  // };

  const handleJoinRoom = async (roomId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/join-room?roomId=${roomId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("roomid", roomId);
      const roomData = res.data;

      // Update RoomContext state
      setPickup(roomData.pickup.text);
      setDestination(roomData.destination.text);
      setRoomid(roomData._id);
      setDistance(roomData.distance);
      setDuration(roomData.duration);
      setFare(roomData.fare);
      setStatus(roomData.status);
      setPcount(roomData.mitra.length);

      // Update creator details
      setCreatorData({
        creatorId: roomData.creatorId._id,
        fullName: roomData.creatorId.fullName,
        email: roomData.creatorId.email,
        mobileNo: roomData.creatorId.mobileNo,
        gender: roomData.creatorId.gender,
        rating: roomData.creatorId.rating,
        createdAt: roomData.creatorId.createdAt,
        updatedAt: roomData.creatorId.updatedAt,
        socketId: roomData.creatorId.socket_id,
        profileImage: roomData.creatorId.docs.profileImageUrl,
      });

      // Update mitra list
      setMitra(
        roomData.mitra.map((mitraObj) => ({
          mitraId: mitraObj.userId._id,
          socketId: mitraObj.userId.socket_id,
        }))
      );

      // Navigate to room-int only after state updates
      // navigate("/room-int");
      navigate(`/room-int?roomid=${roomData._id}`);
    } catch (e) {
      alert("Failed to join room: " + e.message);
    }
  };

  return (
    <Box className="p-4 bg-[#1a1a1a] min-h-screen">
      <Typography variant="h5" className="text-white mb-4 px-2">
        Existing Rooms :
      </Typography>

      <Box className="space-y-4">
        {Array.isArray(roomData) && roomData.length > 0 ? (
          roomData.map((room, index) => (
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
                    onClick={() => handleJoinRoom(room._id)}
                    className="font-semibold px-6 min-w-[100px]"
                    sx={{
                      bgcolor: theme.palette.primaryColor.main,
                      color: theme.palette.txtcol,
                      "&:hover": {
                        bgcolor: theme.palette.primaryColor.hover,
                      },
                    }}
                  >
                    JOIN
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

export default CaptainRooms;
