import { Typography, Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import theme from "../../styles/theme";
import axios from "axios";
import { EntityContext } from "../../contexts";

const UserProfile = () => {
  const yellowTheme = theme.palette.primaryColor.main;
  const { entity, SetEntity } = useContext(EntityContext);
  // const userCredentials = {
  //   email: "ritesh1@ce.vjti.ac.in",
  //   password: "12345678",
  // };

  console.log(entity);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/my-profile`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("in then")
        console.log(res.data);
        alert("done")
        // SetEntity(())
      })
      .catch((e) => {
        console.log(e);
        // 401 - unauthorized error
      });
  }, []);

  return (
    <div className="grid grid-rows-[35px,0.25fr,auto,1fr] items-center justify-center h-[calc(100vh-56px)] md:h-[calc(100vh-64px)] w-screen ">
      <div className="w-[inherit] text-right">
        {/* logout button */}
        <Button
          variant="contained"
          sx={{
            marginTop: "15px",
            marginRight: "10px",
            background: yellowTheme,
          }}
        >
          Log Out
        </Button>
      </div>
      <div className="grid grid-cols-[1fr,auto,1fr] w-[inherit] justify-between items-center">
        <div className="bg-white/30 h-[1px] "></div>
        <img
          className="rounded-full h-28 w-28"
          src="https://media.istockphoto.com/id/2060758269/photo/bronze-bells-in-indian-temple-hindu-temple-bell-brass-made-bell-for-worshiping-god-hanging.jpg?b=1&s=612x612&w=0&k=20&c=H9xtBTNg73u-VbyuSGaYMlubtqNA7XpnrbwaP0eXUXo="
          alt=""
        />
        <div className="bg-white/30 h-[1px] "></div>
      </div>
      <div className="text-center px-1">
        <Typography sx={{ overflowY: "hidden" }} variant="h4">
          Yogesh
        </Typography>
      </div>

      {/* md:grid-cols-2 md:grid-rows-2 md:max-w-[765px] md:gap-x-10 md:gap-y-28 */}
      <div className="w-[inherit] min-h-80 flex place-content-center ">
        <div className="w-[inherit] grid h-auto px-5 gap-y-3 max-w-[500px] md:gap-y-10">
          <TextField
            label="Email"
            variant="standard"
            value={"yogesh@ce.vjti.ac.in"}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Phone Number"
            variant="standard"
            value={"1122334455"}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Gender"
            variant="standard"
            value={"Male"}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
          <TextField
            label="Rating"
            variant="standard"
            value={"5 ⭐"}
            slotProps={{
              inputLabel: { shrink: true },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
