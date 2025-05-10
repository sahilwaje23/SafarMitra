<<<<<<< HEAD
import React from 'react'
import { Typography,Paper } from '@mui/material'
import theme from '../../styles/theme'
function RideDetails() {
  return (
 <>
 <Paper elevation={2} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 ,display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Driver Details</Typography>
 <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Journey Details</Typography>
 </Paper>
 </> 
  )
}

export default RideDetails
=======
import React from "react";
import { Typography, Paper } from "@mui/material";
import theme from "../../styles/theme";
import {
  DriverCard,
  JourneyCard,
  ParticipantCard,
} from "../user/DataForRoomInt";
function RideDetails() {
  const dummyDriver = {
    name: "Rahul Sharma",
    profileImage: "https://via.placeholder.com/150",
    phone: "+91 9876543210",
    vehicleNumber: "MH 12 AB 1234",
    rating: 4.8,
  };

  const dummyParticipant = {
    name: "Anjali Verma",
    profileImage: "https://via.placeholder.com/150",
    phone: "+91 9876543211",
    email: "anjali.verma@example.com",
    gender: "Female",
    rating: 4.6,
    id: 1,
  };

  const dummyJourney = {
    roomId: "XJZP123",
    fare: 250,
    distance: 15.4,
    duration: 32,
    participantCount: 3,
  };

  return (
    <>
      <Paper
        elevation={2}
        sx={{
          bgcolor: "background.paper",
          // paddingY: 2, 
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          rowGap: 2,
        }}
      >
        {/* overall it should be  */}
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <DriverCard driver={dummyDriver} />
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <JourneyCard journey={dummyJourney} />
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <ParticipantCard participant={dummyParticipant} isCreator={true} />
        </Typography>
      </Paper>
    </>
  );
}

export default RideDetails;
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
