import React, { useContext } from "react";
import { Box, Input, TextField, Typography,Button } from "@mui/material";
import Map from "../map/Map";
import theme from "../../styles/theme";
import {EntityContext} from '../../contexts/EntityContext'

const UserHomePage = () => {
  const yellowTheme = theme.palette.primaryColor.main;
  const {entity} = useContext(EntityContext)
  // console.log(entity);
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
            sm: `"info map"`

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
            alignItems: {xs: 'start' , sm: 'center'},
            height: "100%",
          }}
        >
          <div className="flex flex-col justify-center items-center w-[100%] gap-y-5 sm:items-center md:ml-[5rem]">
            <div className="text-3xl font-semibold w-full text-center mx-auto">Enter Ride</div>
            <div className="flex flex-col gap-y-3 w-full justify-center items-center">
              <input type="text" id="source" className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40,0.5)] max-w-[342px] focus:bg-[rgb(40,40,40)] focus:outline-white focus:shadow-2xl shadow-white outline-offset-0 outline-1" placeholder="Enter Source" />
              <input type="text" id="source" className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white outline-offset-0 outline-1" placeholder="Enter Destination" />
              
              {/* Confirm button */}
            <Button
              sx={{ height: "3.3rem", backgroundColor: yellowTheme, text: 'center', width: '100%', maxWidth: '342px' }}
              variant="contained"
              type="submit"
              fullWidth
            >
              <Typography sx={{ fontSize: "large", fontWeight: "bold" }}>
                Continue
              </Typography>
            </Button>
            </div>
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
