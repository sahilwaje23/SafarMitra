import React, { useContext, useEffect } from "react";
import { Box, Input, TextField, Typography, Button } from "@mui/material";
import Map from "../map/Map";
import theme from "../../styles/theme";
import { SocketContext } from "../../contexts/Socket";
import { EntityContext } from "../../contexts/EntityContext";

const UserHomePage = () => {
  const yellowTheme = theme.palette.primaryColor.main;
  const { sendMessage, recieveMessage } = useContext(SocketContext);
  const { entity } = useContext(EntityContext);
  console.log(entity);
  const userId =
    entity.data?._id || JSON.parse(localStorage.getItem("USER"))._id;

  useEffect(() => {
    sendMessage("join", { userType: "USER", userId });

    recieveMessage("confirm-ride", (rideData) => {
      // ^ Chaitanya whatever new ride is confirmed by driver u will get data here
      console.log("Ride Confirmed", rideData);
    });

    recieveMessage("user-joined", (rideData) => {
      // ^ Chaitanya whenever a new user joins a ride u will get data here
      console.log("New User Joined", rideData);
    });

    recieveMessage("new-userJoin", (rideData) => {
      // ^ Chaitanya whenever a new user joins a ride u will get data here
      console.log("New User Joined", rideData);
    });
  }, []);

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
              <input
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
