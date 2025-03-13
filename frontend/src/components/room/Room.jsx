import React, { useState, useEffect } from "react";
import { Typography, Box, Card, Button, useMediaQuery } from "@mui/material";
import { LocationOn, AttachMoney, AccessTime, Group, DirectionsCar } from "@mui/icons-material";
import theme from "../../styles/theme";
import { useLocations } from "../../contexts/LocationsContext.jsx";
import { Link } from "react-router-dom";
const Room = ({ roomData = [] }) => {
  const isMobile = useMediaQuery("(max-width:1024px)");
  const { pickupText, dropText } = useLocations();
  const [filteredRoomData, setFilteredRoomData] = useState(roomData);
  useEffect(() => {
    console.log("Updated filteredRoomData:", filteredRoomData);
  }, [filteredRoomData]);

  useEffect(() => {
    console.log("In room.jsx", filteredRoomData);
    console.log("pickup text", pickupText);
    console.log("drop text", dropText);
    for (const room of roomData) {
      console.log("Room stuff", room);
    }

    if (Array.isArray(roomData)) {

      const filteredRooms = roomData.filter((room) => {
        console.log("Each entity", pickupText.toLowerCase().includes(room.pickup.text.toLowerCase()) && dropText.toLowerCase().includes(room.destination.text.toLowerCase()));
        const pickupMatch = pickupText
          ? pickupText.toLowerCase().includes(room.pickup.text.toLowerCase())
          : true;
        const dropMatch = dropText
          ? dropText.toLowerCase().includes(room.destination.text.toLowerCase())
          : true;
        return pickupMatch && dropMatch;
      });

      setFilteredRoomData([...filteredRooms]);
    }

  }, [roomData, pickupText, dropText]);
  const handleJoinRoom = (roomId) => {
    console.log(`Joining room with ID: ${roomId}`);
    // Add additional join room logic here (e.g., navigation)
  };

  return (
    <Box className="p-4 bg-[#1a1a1a] min-h-screen">
      <Typography variant="h5" className="text-white mb-4 px-2">
        Existing Rooms :
      </Typography>

      <Box className="space-y-4">
        {Array.isArray(filteredRoomData) && filteredRoomData.length > 0 ? (
          filteredRoomData.map((room, index) => (
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 min-w-[100px]"
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

export default Room;