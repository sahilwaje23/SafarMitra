import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import {
  CaptainHomePage,
  CaptainSignIn,
  CaptainSignUp,
  Landing,
  UserHomePage,
  UserSignIn,
  UserSignUp,
  Navbar,
  RoomInt,
  UserProfile,
} from "./components";
import theme from "./styles/theme";
import { useMediaQuery } from "@mui/material";
import UserProtectedWrapper from "./wrappers/UserProtectedWrapper";
import RoomActivities from "./components/user/RoomActivities";
// import { ParticipantCard } from "./components/user/Dummy";

function App() {
  const location = useLocation(); // this has location object which will give information about the current url , this also triggers a re-render if the current location changes
  const type = location.pathname.startsWith("/captain-") ? "captain" : "user";
  const isMobileView = useMediaQuery("(max-width:1024px)");
  // useEffect(() => {
  //   console.log(isMobileView);
  // },[window.innerWidth]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          paddingBottom: isMobileView ? "56px" : "0",
          paddingTop: isMobileView ? "0px" : "64px", // Add top padding for desktop navbar
        }}
      >
        <Routes>
          {/* Driver Route */}

          <Route path="/" element={<Landing />} />
          <Route path="/user-signup" element={<UserSignUp />} />
          <Route path="/user-signin" element={<UserSignIn />} />
          <Route path="/captain-signup" element={<CaptainSignUp />} />
          <Route path="/captain-signin" element={<CaptainSignIn />} />
          <Route path="/user-homepage" element={<UserHomePage />} />
          <Route path="/captain-homepage" element={<CaptainHomePage />} />
          <Route
            path="/user-history"
            element={
              <UserProtectedWrapper>
                <div>history </div>
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/user-profile"
            element={
              <UserProtectedWrapper>
                <UserProfile />
              </UserProtectedWrapper>
            }
          />
          <Route
            path="/room-activities"
            element={
              <UserProtectedWrapper>
                <RoomActivities />
              </UserProtectedWrapper>
            }
          />
          <Route path="/room-int" element={<RoomInt />} />
          <Route
            path="/join-room"
            element={
              <UserProtectedWrapper>
                <RoomInt />
              </UserProtectedWrapper>
            }
          />
          <Route path="/captain-profile" element={<div>Captain Profile</div>} />
          <Route
            path="/captain-nearby-rooms"
            element={<div>Nearby Rooms</div>}
          />
        </Routes>
      </div>
      <Navbar type={type} />
    </ThemeProvider>
  );
}

export default App;
