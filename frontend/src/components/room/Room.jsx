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

  const [joiningRoomId, setJoiningRoomId] = useState(null);

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
      setJoiningRoomId(roomId);
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
      setPickup((roomData.pickupAddress || roomData.pickup?.text));
      setDestination((roomData.dropAddress || roomData.destination?.text));
      setRoomid(roomData._id);
      setDistance(roomData.distance);
      setDuration(roomData.duration);
      setFare(roomData.fare);
      setStatus(roomData.status);
      setPcount((roomData.mitras || roomData.mitra || []).length);

      const creator = roomData.creator || roomData.creatorId || {};

      // Update creator details
      setCreatorData({
        creatorId: creator.id || creator._id,
        fullName: creator.fullName,
        email: creator.email,
        mobileNo: creator.mobileNo,
        gender: creator.gender,
        rating: creator.rating,
        createdAt: creator.createdAt,
        updatedAt: creator.updatedAt,
        socketId: creator.socket_id || creator.socketId,
        profileImage: creator.profileImageUrl || creator.docs?.profileImageUrl,
      });

      // Update mitra list
      setMitra(
        (roomData.mitras || roomData.mitra || []).map((mitraObj) => {
          const userObj = mitraObj.user || mitraObj.userId || {};
          return {
            mitraId: userObj.id || userObj._id,
            socketId: userObj.socket_id || userObj.socketId,
          };
        })
      );

      // Navigate to room-int only after state updates
      // navigate("/room-int");
      navigate(`/room-int?roomid=${roomData.id || roomData._id}`);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.rideError) {
        alert(e.response.data.rideError);
      } else {
        alert("Failed to join room: " + (e.response?.data?.error || e.message));
      }
    } finally {
      setJoiningRoomId(null);
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
                          {room._id?.toString()?.substring(0, 8)}
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
                              {(room.pickupAddress || room.pickup?.text)}
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
                              {(room.dropAddress || room.destination?.text)}
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
                              {(room.mitras || room.mitra || []).length}{" "}
                              {(room.mitras || room.mitra || []).length === 1 ? "user" : "users"}
                            </span>
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => handleJoinRoom(room.id || room._id)}
                    disabled={joiningRoomId !== null}
                    className="font-semibold px-6 min-w-[100px]"
                    sx={{
                      bgcolor: theme.palette.primaryColor.main,
                      color: theme.palette.txtcol,
                      "&:hover": {
                        bgcolor: theme.palette.primaryColor.hover,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "small",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {joiningRoomId === (room.id || room._id) ? "JOINING..." : "JOIN"}
                    </Typography>
                  </Button>
                </Box>
              </Box>
            </Card>
          ))
        ) : (
          <Card className="bg-[#2a2a2a] p-6">
            <Typography className="text-white text-center">
              No matching rides found. Create a new room?
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default Room;
