import React, { useEffect } from "react";
import { Typography, Paper } from "@mui/material";
import theme from "../../styles/theme";
import {
  DriverCard,
  JourneyCard,
  ParticipantCard,
} from "../user/DataForRoomInt";
import { useRoom } from "../../contexts/RoomContext";
import { EntityContext } from "../../contexts/EntityContext";
import { useContext } from "react";
// this is  essentially information for room interface data should be fetched from context and displayed here
// some things  are delibarately commented out and left there to verify the existing behaviour
// conditional rendering ensures if driver doesnt , mitras dont exist yet they wont be showcased
function RideDetails({ isDriverView }) {
  const { entity } = useContext(EntityContext);
  const currentUserId = entity?.id || entity?._id || JSON.parse(localStorage.getItem("USER"))?.id || JSON.parse(localStorage.getItem("USER"))?._id || JSON.parse(localStorage.getItem("DRIVER"))?.id || JSON.parse(localStorage.getItem("DRIVER"))?._id;
  const {
    roomid,
    creatorData,
    distance,
    duration,
    fare,
    mitra,
    driverData,
    pcount,
    limit,
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
    email: driverData?.email || null,
    vehicleNumber: driverData?.vehicleNo || null,
    rating: driverData?.rating || "NA",
    id: driverData?.socketId || null,
  };

  // Check if driver has a valid ID
  const hasValidDriver = Boolean(driverData?.driverId);

  // need to initialize this properly
  const creator = {
    name: creatorData?.fullName || null,
    profileImage: creatorData?.profileImage || null,
    phone: creatorData?.mobileNo || null,
    email: creatorData?.email || null,
    gender: creatorData?.gender || null,
    rating: creatorData?.rating || "NA",
    id: creatorData?.creatorId || null,
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
    .map((m) => {
      const u = m?.user || m || {};
      return {
        name: u.fullName || null,
        profileImage: u.profileImageUrl || u.docs?.profileImageUrl || u.docs?.profileImage || null,
        phone: u.mobileNo || null,
        email: u.email || null,
        gender: u.gender || null,
        rating: u.rating,
        id: u.id
      };
    })
    .filter((m) =>
      Object.values(m).some((value) => value !== null && value !== undefined)
    );

    console.log("mitras are here",mitras)

  const journey = {
    roomId: roomid?.toString()?.slice(0, 7) || "XJZP123",
    fare: fare ?? 250,
    distance: distance ?? 15.4,
    duration: duration ?? 32,
    participantCount: pcount ?? 1,
    limit: limit ?? 1,
  };

  useEffect(() => {
    console.log("The creator data in ride details is ", creatorData);
  }, [creatorData]);
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
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", width: "100%", p: "1" }}
        >
          <JourneyCard journey={journey} />
        </Typography>
        {!isDriverView && (
          hasValidDriver ? (
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", width: "100%", p: "1" }}
            >
              <DriverCard driver={driver} />
            </Typography>
          ) : (
            "No Driver assigned yet"
          )
        )}

        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", width: "100%", p: "1" }}
        />

        {mitras.length > 0
          ? mitras.map((mitra, index) => (
              <Typography
                key={index}
                variant="h6"
                sx={{ fontWeight: "bold", width: "100%", p: "1" }}
              >
                <ParticipantCard participant={mitra} isCreator={false} isCurrentUser={mitra.id === currentUserId || mitra.socketId === currentUserId} />
              </Typography>
            ))
          : "No Mitras assigned yet"}
        <Typography
          variant="h6"
          sx={{ fontWeight: "bold", width: "100%", p: "1" }}
        >
          <ParticipantCard participant={creator} isCreator={true} isCurrentUser={creator.id === currentUserId} />
        </Typography>
      </Paper>
    </>
  );
}

export default RideDetails;
