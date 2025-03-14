import React from "react";
import { Typography, Paper } from "@mui/material";
import theme from "../../styles/theme";
import {
  DriverCard,
  JourneyCard,
  ParticipantCard,
} from "../user/DataForRoomInt";
import { useRoom } from "../../contexts/RoomContext";
// this is  essentially information for room interface data should be fetched from context and displayed here
function RideDetails() {
  const {
    roomid,
    creatorData,
    distance,
    duration,
    fare,
    mitra,
    driverData,
    pcount
  } = useRoom();
  // const dummyDriver = {
  //   name: "Rahul Sharma",
  //   profileImage: "https://via.placeholder.com/150",
  //   phone: "+91 9876543210",
  //   vehicleNumber: "MH 12 AB 1234",
  //   rating: 4.8,
  // };

  // const dummyParticipant = {
  //   name: "Anjali Verma",
  //   profileImage: "https://via.placeholder.com/150",
  //   phone: "+91 9876543211",
  //   email: "anjali.verma@example.com",
  //   gender: "Female",
  //   rating: 4.6,
  //   id: 1,
  // };

  // const dummyJourney = {
  //   roomId: "XJZP123",
  //   fare: 250,
  //   distance: 15.4,
  //   duration: 32,
  //   participantCount: 3,
  // };

  const driver = {
    name: driverData?.fullName || "Rahul Sharma",
    profileImage: driverData?.profileImage || "https://via.placeholder.com/150",
    phone: driverData?.mobileNo || "+91 9876543210",
    vehicleNumber: driverData?.vehicleNo || "MH 12 AB 1234",
    rating: driverData?.rating ?? 4.8,
    driverId: driverData?.driverId || "fbje2bjeb2jbejqb",
  };

  const creator = {
    name: creatorData?.fullName || "Anjali Verma",
    profileImage: creatorData?.profileImage || "https://via.placeholder.com/150",
    phone: creatorData?.mobileNo || "+91 9876543211",
    email: creatorData?.email || "anjali.verma@example.com",
    gender: creatorData?.gender || "Female",
    rating: creatorData?.rating ?? 4.6,
    id: creatorData?.creatorId || "fbje2bjeb2jbejqb",
  };

  const mitras = mitra.map((m) => ({
    name: m?.mitraName || "Ritesh",
    profileImage: m?.profileImage || "https://via.placeholder.com/150",
    phone: m?.mobileNo || "+91 0000000000",
    email: m?.mitraEmail || "dushmanokarakhvala@rityaman.com",
    gender: m?.gender || "female",
    rating: m?.mitraRating ?? 4.5,
    id: m?.mitraId || 'n4j2n3j2ejb2j',
  }));

  const journey = {
    roomId: roomid || "XJZP123",
    fare: fare ?? 250,
    distance: distance ?? 15.4,
    duration: duration ?? 32,
    participantCount: pcount ?? 3,
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
          <JourneyCard journey={dummyJourney} />
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <DriverCard driver={dummyDriver} />
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <ParticipantCard participant={dummyParticipant} isCreator={true} />
        </Typography>
      </Paper>
    </>
  );
}

export default RideDetails;