import React from "react";
import { Routes, Route } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { CaptainSignIn, CaptainSignUp, Landing, UserSignIn, UserSignUp } from "./components";
import { useTheme } from "@mui/material/styles";

function App({ toggleTheme }) {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/user-signin" element={<UserSignIn />} />
        <Route path="/captain-signup" element={<CaptainSignUp />} />
        <Route path="/captain-signin" element={<CaptainSignIn />} />
        {/* Add further routes here */}
      </Routes>
    </Box>
  );
}

export default App;
