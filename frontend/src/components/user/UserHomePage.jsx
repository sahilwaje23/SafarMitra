import React, { useContext, useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Map from "../map/Map";
import theme from "../../styles/theme";
import { EntityContext } from "../../contexts/EntityContext";
import InputWithSuggestions from "./SuggestionsList";
import { useLocations } from "../../contexts/LocationsContext";
import { SocketContext } from "../../contexts/Socket";
import axios from "axios";
import { useRoom } from "../../contexts/RoomContext";
import ActiveRideComponent from "./ActiveRideComponent";

const UserHomePage = () => {
  const [loading, setLoading] = useState(true);
  const yellowTheme = theme.palette.primaryColor.main;
  const { entity } = useContext(EntityContext);
  const {
    pickupLat,
    setPickupLat,
    pickupLng,
    setPickupLng,
    dropLat,
    setDropLat,
    dropLng,
    setDropLng,
    pickupText,
    setPickupText,
    dropText,
    setDropText,
  } = useLocations();
  const navigate = useNavigate(); // Initialize navigate
  const { sendMessage, recieveMessage } = useContext(SocketContext);
  const userId =
    entity.data?._id || JSON.parse(localStorage.getItem("USER"))._id;
  console.log("here", entity);

  const [pickupData, setPickupData] = useState({
    pickupLat,
    pickupLng,
    pickupText,
  });

  const [dropData, setDropData] = useState({
    dropLat,
    dropLng,
    dropText,
  });
  // tracks
  useEffect(() => {
    console.log("Initial pickup", pickupData);
    console.log("Initial drop", pickupData);
  }, []);
  useEffect(() => {
    console.log("Updated Pickup Data", pickupData);
    console.log("Updated Drop Data", dropData);
  }, [dropData, pickupData]);

  useEffect(() => {
    sendMessage("join", { userType: "USER", userId });
  }, []);

  const handlePickupSelect = (value) => {
    if (value && value.lat && value.lng && value.description) {
      setPickupLat(value.lat);
      setPickupLng(value.lng);
      setPickupText(value.description);

      setPickupData({
        pickupText: value.description,
        pickupLat: value.lat,
        pickupLng: value.lng,
      });
    } else {
      console.error("Selected value does not have the required structure.");
    }
  };

  const [currActRide, setCurrActRide] = useState(null);
  useEffect(() => {
    if (entity.currActiveRide) {
      console.log("ride", entity.currActiveRide);
      const fetchRideDetails = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/ride/get-ride-details?rideId=${
              entity.currActiveRide
            }`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              withCredentials: true,
            }
          );
          console.log("Ride details:", response.data);
          setCurrActRide(response.data);
        } catch (error) {
          console.error("Error fetching ride details:", error);
        }
      };
      fetchRideDetails();
    }
  }, []);

  const handleDropSelect = (value) => {
    if (value && value.lat && value.lng && value.description) {
      setDropLat(value.lat);
      setDropLng(value.lng);
      setDropText(value.description);
      setDropData({
        dropText: value.description,
        dropLat: value.lat,
        dropLng: value.lng,
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
      {entity.currActiveRide && (
        <div className="absolute right-0 h-[32px] w-[24%] bg-[#1E1E2F] z-10">
          <ActiveRideComponent info={currActRide} />
        </div>
      )}

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

            {entity.currActiveRide ? (
              "You cannot book one more ride"
            ) : (
              <div className="flex flex-col gap-y-3 w-full justify-center items-center">
                <div className="text-2xl font-semibold w-full text-center mx-auto">
                  Please enter Ride Details
                </div>
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
            )}
          </div>
        </Box>
        <div className=" w-[100%] h-[100%] text-center flex justify-center items-center ">
          <Map pickupData={pickupData} dropData={dropData} />
        </div>
      </Box>
    </>
  );
};

export default UserHomePage;
