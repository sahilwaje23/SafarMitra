import React, { useEffect } from "react";
import theme from "../../styles/theme";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Landing = () => {
  const isDarkMode = theme.palette.mode === "dark";
  const yellowTheme = theme.palette.primaryColor.main;
  const redTheme = theme.palette.secondaryColor.main;

  // comment this down always
  // useEffect(() => {
  //   const user = localStorage.getItem("USER");
  //   const driver = localStorage.getItem("DRIVER");

  //   if (user) {
  //     window.location.href = "/user-homepage";
  //   } else if (driver) {
  //     window.location.href = "/captain-homepage";
  //   }
  // }, []);

  return (
    <Box
      sx={{
        display: "flex",
        gap: "0.6rem",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        maxWidth: "100%",
        height: "100vh",
        padding: "1rem",
        borderRadius: "1rem",
        backdropFilter: "blur(10px)",
        textAlign: "center",
      }}
    >
      <Box sx={{ width: "50%", margin: "0.4rem" }}>
        <img
          draggable="false"
          src="/safarmitrac.svg"
          alt="safarmitra-logo"
          className="drop-shadow-xl"
          style={{ width: "100%", userSelect: "none" }}
        />
      </Box>

      <Typography variant="h3" component="h1">
        Hello, welcome to SafarMitra
      </Typography>

      <Typography variant="h5" component="p" gutterBottom>
        Please let us know, are you a:
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          [theme.breakpoints.up("sm")]: {
            flexDirection: "row",
          },
        }}
      >
        <Link to="/user-signup">
          <Button
            variant="contained"
            sx={{
              fontWeight: "bold",
              width: "10rem",
              "&:hover": { backgroundColor: theme.palette.primaryColor.hover },
              backgroundColor: yellowTheme,
            }}
          >
            User
          </Button>
        </Link>

        <Link to="/captain-signup">
          <Button
            variant="contained"
            color="secondary"
            sx={{
              color: "text",
              backgroundColor: redTheme,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: theme.palette.secondaryColor.hover,
              },
              width: "10rem",
            }}
          >
            Driver
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Landing;
