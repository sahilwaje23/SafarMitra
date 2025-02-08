import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Map from "../map/Map";
import theme from "../../styles/theme";
import { EntityContext } from "../../contexts/EntityContext";
import InputWithSuggestions from "./SuggestionsList";
import { useLocations } from "../../contexts/LocationsContext";
import axios from 'axios';

const UserHomePage = () => {
  const [loading, setLoading] = useState(true);
  const yellowTheme = theme.palette.primaryColor.main;
  const { entity } = useContext(EntityContext);
  const { pickupLat, setPickupLat, pickupLng, setPickupLng, dropLat, setDropLat, dropLng, setDropLng, pickupText, setPickupText, dropText, setDropText } = useLocations();
  const navigate = useNavigate(); // Initialize navigate

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
// tracks
  useEffect(()=>{
    console.log("Initial pickup",pickupData);
    console.log("Initial drop",pickupData);
  },[]);
  useEffect(() => {
    console.log("Updated Pickup Data", pickupData);
    console.log("Updated Drop Data", dropData);
  }, [dropData, pickupData]);

  useEffect(() => {
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
        navigate("/user/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handlePickupSelect = (value) => {
    if (value && value.lat && value.lng && value.description) {
      setPickupLat(value.lat);
      setPickupLng(value.lng);
      setPickupText(value.description);

      setPickupData({
        pickupText: value.description,
        pickupLat: value.lat,
        pickupLng: value.lng
      });
    } else {
      console.error("Selected value does not have the required structure.");
    }
  };

  const handleDropSelect = (value) => {
    if (value && value.lat && value.lng && value.description) {
      setDropLat(value.lat);
      setDropLng(value.lng);
      setDropText(value.description);
      setDropData({
        dropText: value.description,
        dropLat: value.lat,
        dropLng: value.lng
      });
    } else {
      console.error("Selected value does not have the required structure.");
    }
  };


  const handleContinue = () => {
    if (!pickupText || !dropText) {
      alert("Please select both source and destination.");
      return;
    }
    navigate("/room-activities"); // Navigate to RoomActivities
  };

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
              <InputWithSuggestions
                inputId="source"
                placeholder="Enter Source"
                onSelect={handlePickupSelect}
              />
              <InputWithSuggestions
                inputId="destination"
                placeholder="Enter Destination"
                onSelect={handleDropSelect}
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
                onClick={handleContinue} // Add onClick handler
              >
                <Typography sx={{ fontSize: "large", fontWeight: "bold" }}>
                  Continue
                </Typography>
              </Button>
            </div>
          </div>
        </Box>
        <div className=" w-[100%] h-[100%] text-center flex justify-center items-center ">
          <Map/>
        </div>
      </Box>
    </>
  );
};

export default UserHomePage;