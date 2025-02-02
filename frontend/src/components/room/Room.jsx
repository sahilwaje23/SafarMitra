import React from "react";
import { Typography, Box, Card, Button } from "@mui/material";
import {
  LocationOn,
  AttachMoney,
  AccessTime,
  Group,
  DirectionsCar,
} from "@mui/icons-material";

const Room = ({ roomData = [] }) => {
  const handleJoinRoom = (roomId) => {
    console.log(`Joining room with ID: ${roomId}`);
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
