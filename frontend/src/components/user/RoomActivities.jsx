import React from "react";
import { Button, Typography } from "@mui/material";
import theme from "../../styles/theme";
import Room from "../room/Room";

const RoomActivities = () => {
  const yellowTheme = theme.palette.primaryColor.main;

  return (
    <div className="w-full h-[calc(100vh-64px)] min-w-[100vw] grid grid-cols-1 md:grid-cols-2">
      {/* left or create room */}
      <div className="flex flex-col items-center justify-center w-full h-full max-h-screen gap-y-8">
        {/* inputs fileds */}
        <div className="hidden md:flex flex-col gap-y-3 w-full justify-center items-center pb-2">
          <label className="text-start w-full max-w-[342px] pl-1 text-xl" htmlFor="">Source :</label>
          <input
            type="text"
            id="source" 
            className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40,0.5)] max-w-[342px] focus:bg-[rgb(40,40,40)] focus:outline-white/50 focus:shadow-2xl shadow-white outline-offset-0 outline-2"
            placeholder="Enter Source"
          />
          <label className="text-start w-full max-w-[342px] pl-1 text-xl" htmlFor="">Destination :</label>
          <input
            type="text"
            id="destination"
            className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white/50 outline-offset-0 outline-2"
            placeholder="Enter Destination"
          />
          <label className="text-start w-full max-w-[342px] pl-1 text-xl" htmlFor="">Passenger Limit :</label> 
          <input
            type="number"
            max={4}
            min={1}
            id="limit"
            className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white/50 outline-offset-0 outline-2"
            placeholder="Passenger Limit"
          />
        </div>

        {/* Button */}
        <div className="flex flex-col gap-y-3 w-full justify-center items-center mt-12 md:mt-0">
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
              Create Room
            </Typography>
          </Button>
        </div>
      </div>

      <div className="md:hidden text-center my-10 grid grid-cols-[1fr,auto,1fr] place-content-center items-center">
  <div className="bg-white/30 h-[0.5px] w-full"></div>
  <div className="text-center text-white px-4 ">OR</div>
  <div className="bg-white/30 h-[0.5px] w-full"></div>
</div>

           
      {/* relavant rooms */}
      <div className="border-2 rounded-lg border-white/30 m-1 max-h-screen h-auto flex flex-col gap-y-3 overflow-y-scroll overflow-x-hidden">
        {/* <div className="text-center text-xl pt-3">Existing Rooms</div> */}
        <div>
          <Room/>
        </div>
      </div>
    </div>
  );
};

export default RoomActivities;
