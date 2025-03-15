import React, { useEffect } from "react";
import { Typography, Paper } from "@mui/material";
import theme from "../../styles/theme";
import {
  DriverCard,
  JourneyCard,
  ParticipantCard,
} from "../user/DataForRoomInt";
import { useRoom } from "../../contexts/RoomContext";
// this is  essentially information for room interface data should be fetched from context and displayed here
// some things  are delibarately commented out and left there to verify the existing behaviour
// conditional rendering ensures if driver doesnt , mitras dont exist yet they wont be showcased 
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
  //   profileImage: "https://via`.placeholder.com/150",
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

  // const driver = {
  //   name: driverData?.fullName || "Rahul Sharma",
  //   profileImage: driverData?.profileImage || "https://via.placeholder.com/150",
  //   phone: driverData?.mobileNo || "+91 9876543210",
  //   vehicleNumber: driverData?.vehicleNo || "MH 12 AB 1234",
  //   rating: driverData?.rating ?? 4.8,
  //   driverId: driverData?.driverId || "fbje2bjeb2jbejqb",
  // };

  const driver = {
    name: driverData?.fullName || null,
    profileImage: driverData?.profileImage || null,
    phone: driverData?.mobileNo || null,
    vehicleNumber: driverData?.vehicleNo || null,
    rating: driverData?.rating ?? null,
    driverId: driverData?.driverId || null,
  };

  // Check if driver has at least one valid property
  const hasValidDriver = Object.values(driver).some((value) => value !== null && value !== undefined);

  // need to initialize this properly 
  const creator = {
    name: creatorData?.fullName || "Anjali Verma",
    profileImage: creatorData?.profileImage || "https://via.placeholder.com/150",
    phone: creatorData?.mobileNo || "+91 9876543211",
    email: creatorData?.email || "anjali.verma@example.com",
    gender: creatorData?.gender || "Female",
    rating: creatorData?.rating ?? 4.6,
    id: creatorData?.creatorId || "fbje2bjeb2jbejqb",
  };

  // const mitras = mitra
  //   .map((m) => ({
  //     name: m?.mitraName || "RityaMan",
  //     profileImage: m?.profileImage || "https://via.placeholder.com/150",
  //     phone: m?.mobileNo || "+91 8912353232",
  //     email: m?.mitraEmail || "mainHoonRityaManDushmanoKaRakhvala@rityaman.com",
  //     gender: m?.gender || "Female",
  //     rating: m?.mitraRating ?? 0,
  //     id: m?.mitraId || "f2f3fh2ue2ueruqb",
  //   }))
  //   .filter((m) => Object.values(m).some((value) => value !== null && value !== undefined));

  const mitras = mitra
    .map((m) => ({
      name: m?.mitraName || null,
      profileImage: m?.profileImage || null,
      phone: m?.mobileNo || null,
      email: m?.mitraEmail || null,
      gender: m?.gender || null,
      rating: m?.mitraRating ?? null,
      id: m?.mitraId || null,
    }))
    .filter((m) => Object.values(m).some((value) => value !== null && value !== undefined));

  const journey = {
    roomId: (roomid?.slice(0, 7) || "XJZP123"),
    fare: fare ?? 250,
    distance: distance ?? 15.4,
    duration: duration ?? 32,
    // above not initialised correctly
    participantCount: pcount ?? 3,
  };

  useEffect(() => {
    console.log("The creator data in ride details is ", creatorData);
  }, [creatorData])
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
        {/* <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <JourneyCard journey={dummyJourney} />
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <DriverCard driver={dummyDriver} />
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <ParticipantCard participant={dummyParticipant} isCreator={true} />
        </Typography> */}
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <JourneyCard journey={journey} />
        </Typography>
        {hasValidDriver && (
          <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
            <DriverCard driver={driver} />
          </Typography>
        )}
        {mitras.length > 0 &&
          mitras.map((mitra, index) => (
            <Typography key={index} variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
              <ParticipantCard participant={mitra} isCreator={false} />
            </Typography>
          ))
        }
        <Typography variant="h6" sx={{ fontWeight: "bold", width: "100%", p: "1" }}>
          <ParticipantCard participant={creator} isCreator={true} />
        </Typography>


      </Paper>
    </>
  );
}

export default RideDetails;