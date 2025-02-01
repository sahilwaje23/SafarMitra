import React, { useContext, useEffect, useState } from "react";
import { Box, Input, TextField, Typography, Button } from "@mui/material";
import Map from "../map/Map";
import theme from "../../styles/theme";
import { SocketContext } from "../../contexts/Socket";
import { EntityContext } from "../../contexts/EntityContext";
import InputWithSuggestions from "./SuggestionsList";
import { useLocations } from "../../contexts/LocationsContext"
import axios from 'axios';

const UserHomePage = () => {
  const [loading, setLoading] = useState(true);
  const yellowTheme = theme.palette.primaryColor.main;
  const { sendMessage, recieveMessage } = useContext(SocketContext);
  const { entity } = useContext(EntityContext);
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
      navigate("/user/signin"); // Redirect if unauthorized
    } finally {
      setLoading(false);
    }
  };

  console.log("entity from user home page", entity);
  const userId =
    entity.data?._id || JSON.parse(localStorage.getItem("USER"))._id;

  const { pickupLat, setPickupLat, pickupLng, setPickupLng, dropLat, setDropLat, dropLng, setDropLng, pickupText, setPickupText, dropText, setDropText } = useLocations();
  // chaitanya use this varibles 

  const [pickupData, setPickupData] = useState({
    pickupLat,
    pickupLng,
    pickupText
  });

  const [dropData, setDropData] = useState({
    dropLat,
    dropLng,
    dropText
  });


  // useEffect(() => {
  //   sendMessage("join", { userType: "USER", userId });

  //   recieveMessage("confirm-ride", (rideData) => {
  //     // ^ Chaitanya whatever new ride is confirmed by driver u will get data here
  //     console.log("Ride Confirmed", rideData);
  //   });

  //   recieveMessage("user-joined", (rideData) => {
  //     // ^ Chaitanya whenever a new user joins a ride u will get data here
  //     console.log("New User Joined", rideData);
  //   });

  //   recieveMessage("new-userJoin", (rideData) => {
  //     // ^ Chaitanya whenever a new user joins a ride u will get data here
  //     console.log("New User Joined", rideData);
  //   });
  // }, []);

  useEffect(() => {
    if (!userId) return;

    sendMessage("join", { userType: "USER", userId });

    recieveMessage("confirm-ride", (rideData) => {
      console.log("Ride Confirmed", rideData);
    });

    recieveMessage("user-joined", (rideData) => {
      console.log("New User Joined", rideData);
    });

    recieveMessage("new-userJoin", (rideData) => {
      console.log("New User Joined", rideData);
    });

  }, [userId]);

  return (
    <>
      <Box
        sx={{
          paddingX: "1rem",
          display: "grid",
          width: "100%",
          minHeight: "calc(100vh - 64px)",
          height: "100%",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gridTemplateRows: { xs: "1.2fr 1fr", sm: "1fr" },
          gridTemplateAreas: {
            xs: `"map"
                 "info"`,
            sm: `"info map"`,

            // md: `"info map"`,
          },
          gap: "1rem",
        }}
      >
        <Box
          sx={{
            gridArea: "info",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "start", sm: "center" },
            height: "100%",
          }}
        >
          <div className="flex flex-col justify-center items-center w-[100%] gap-y-5 sm:items-center md:ml-[5rem]">
            <div className="text-5xl font-semibold w-full text-center mx-auto">
              Hello user
            </div>
            <div className="text-2xl font-semibold w-full text-center mx-auto">
              Please enter Ride Details
            </div>
            <div className="flex flex-col gap-y-3 w-full justify-center items-center">

              {/* ignore this inputs */}
              {/* <input
                type="text"
                id="source"
                className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40,0.5)] max-w-[342px] focus:bg-[rgb(40,40,40)] focus:outline-white focus:shadow-2xl shadow-white outline-offset-0 outline-1"
                placeholder="Enter Source"
              />
              <input
                type="text"
                id="source"
                className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white outline-offset-0 outline-1"
                placeholder="Enter Destination"
              /> */}

              {/* source destination inputs with suggestion - from SuggestionList.jsx */}
              {/* <InputWithSuggestions inputId="source" placeholder="Enter Source" onSelect={setPickupData} chai = "source"/>
              <InputWithSuggestions inputId="destination" placeholder="Enter Destination" onSelect={setDropData} /> */}
              <InputWithSuggestions
                inputId="source"
                placeholder="Enter Source"
                onSelect={(value) => setPickupData({ ...pickupData, pickupText: value })}
              />

              <InputWithSuggestions
                inputId="destination"
                placeholder="Enter Destination"
                onSelect={(value) => setDropData({ ...dropData, dropText: value })}
              />

              <Button
                sx={{
                  height: "3.3rem",
                  backgroundColor: yellowTheme,
                  text: "center",
                  width: "100%",
                  maxWidth: "342px",
                }}
                variant="contained"
                type="submit"
                fullWidth
              >
                <Typography sx={{ fontSize: "large", fontWeight: "bold" }}>
                  Continue
                </Typography>
              </Button>
            </div>
            {/* Confirm button */}
          </div>
        </Box>
        <div className=" w-[100%] h-[100%] text-center flex justify-center items-center ">
          <Map />
        </div>
      </Box>
    </>
  );
};

export default UserHomePage;
