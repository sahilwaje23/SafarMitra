import React from 'react';
import { Card, Box, Typography, Button, Avatar } from '@mui/material';
import { AiFillStar, AiFillCrown } from 'react-icons/ai';
import { BsTelephone } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { FaCar } from 'react-icons/fa';

// Driver Card Component
const DriverCard = ({ driver }) => {
  return (
    <Card className="w-full hover:bg-[#333333] transition-colors border-0">
      <Box className="py-4 px-1">
        <Box className="flex justify-between items-start">
          <Box className="flex gap-4">
            <Avatar 
              src={driver.profileImage} 
              alt={driver.name}
              className="w-12 h-12"
            >
              {driver.name?.charAt(0)}
            </Avatar>
            <Box className="space-y-3">
              <Box className="flex items-center gap-2">
                <Typography className="text-white text-lg font-semibold">
                  {driver.name}
                </Typography>
              </Box>
              <Box className="space-y-2">
                <Box className="flex items-center gap-3">
                  <BsTelephone className="text-white/70 text-base" />
                  <Typography className="text-white/80 text-sm">
                    {driver.phone}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-3">
                  <FaCar className="text-white/70 text-base" />
                  <Typography className="text-white/80 text-sm">
                    {driver.vehicleNumber}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="flex items-center gap-1">
            <AiFillStar className="text-yellow-500 text-xl" />
            <Typography className="text-white font-semibold">
              {driver.rating}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

// Participant Card Component
const ParticipantCard = ({ participant, isCreator }) => {
  return (
    <Card className="w-full  hover:bg-[#333333] transition-colors border-0">
      <Box className="py-4 px-1">
        <Box className="flex justify-between items-start">
          <Box className="flex gap-4">
            <Avatar 
              src={participant.profileImage} 
              alt={participant.name}
              className="w-12 h-12"
            >
              {participant.name?.charAt(0)}
            </Avatar>
            <Box className="space-y-3">
              <Box className="flex items-center gap-2">
                <Typography className="text-white text-lg font-semibold">
                  {participant.name}
                </Typography>
                {isCreator && <AiFillCrown className="text-yellow-500 text-xl" />}
              </Box>
              <Box className="space-y-2">
                <Box className="flex items-center gap-3">
                  <BsTelephone className="text-white/70 text-base" />
                  <Typography className="text-white/80 text-sm">
                    {participant.phone}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-3">
                  <MdEmail className="text-white/70 text-base" />
                  <Typography className="text-white/80 text-sm">
                    {participant.email}
                  </Typography>
                </Box>
                <Typography className="text-white/50 text-sm">
                  Gender: <span className="text-white ml-2">{participant.gender}</span>
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box className="space-y-4">
            <Box className="flex items-center gap-1">
              <AiFillStar className="text-yellow-500 text-xl" />
              <Typography className="text-white font-semibold">
                {participant.rating}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

// Journey Details Card Component
const JourneyCard = ({ journey }) => {
  return (
    <Card className="w-full bg-[#2a2a2a] hover:bg-[#333333] transition-colors border-0">
      <Box className="py-4 px-1">
        <Box className="space-y-4">
          <Box className="flex items-center gap-2">
            <Typography className="text-white text-lg">
              Room ID:{' '}
              <span className="text-yellow-500 font-mono">
                {journey.roomId}
              </span>
            </Typography>
          </Box>
          
          <Box className="grid gap-3">
            <Box className="flex items-center gap-3">
              <Typography className="text-white/50 text-sm">
                Fare: <span className="text-white ml-2">₹ {journey.fare}</span>
              </Typography>
            </Box>
            
            <Box className="flex items-center gap-3">
              <Typography className="text-white/50 text-sm">
                Distance: <span className="text-white ml-2">{journey.distance} km</span>
              </Typography>
            </Box>
            
            <Box className="flex items-center gap-3">
              <Typography className="text-white/50 text-sm">
                Duration: <span className="text-white ml-2">{journey.duration} mins</span>
              </Typography>
            </Box>
            
            <Box className="flex items-center gap-3">
              <Typography className="text-white/50 text-sm">
                Participants:{' '}
                <span className="text-white ml-2">
                  {journey.participantCount} {journey.participantCount === 1 ? 'user' : 'users'}
                </span>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export { DriverCard, ParticipantCard, JourneyCard };