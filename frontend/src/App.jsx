import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, useMediaQuery } from "@mui/material";
import { 
  CaptainHomePage, 
  CaptainSignIn, 
  CaptainSignUp, 
  Landing, 
  UserHomePage, 
  UserSignIn, 
  UserSignUp, 
  UserProfile, 
  RoomInt 
} from './components';
import Navbar from './components/navbar/Navbar';
import theme from './styles/theme';
import UserProtectWrapper from "./wrappers/UserProtectedWrapper";

function App() {
  const location = useLocation(); // Provides information about the current URL and triggers re-render on location change.
  const type = location.pathname.startsWith('/captain-') ? 'captain' : 'user';
  const isMobileView = useMediaQuery('(max-width:1024px)');

  return (
  
    <ThemeProvider theme={theme}>
      
      <CssBaseline />
      <div style={{ 
        paddingBottom: isMobileView ? '56px' : '0',
        paddingTop: isMobileView ? '0px' : '64px' // Add top padding for desktop navbar
      }}>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/user-signup' element={<UserSignUp />} />
          <Route path='/user-signin' element={<UserSignIn />} />
          <Route path='/captain-signup' element={<CaptainSignUp />} />
          <Route path='/captain-signin' element={<CaptainSignIn />} />
          <Route path='/user-homepage' element={<UserHomePage />} />
          <Route path='/captain-homepage' element={<CaptainHomePage />} />
          <Route path='/user-history' element={<div>User History</div>} />

          <Route path='/user-profile' element={
            <UserProtectWrapper>
              <UserProfile />
            </UserProtectWrapper>
          } />

          <Route path='/create-room' element={<div>Create Room</div>} />
          <Route path='/join-room' element={<RoomInt />} />
          <Route path='/captain-history' element={<RoomInt />} />
          <Route path='/captain-earnings' element={<div>Earnings</div>} />
          <Route path='/captain-profile' element={<div>Captain Profile</div>} />
          <Route path='/captain-nearby-rooms' element={<div>Nearby Rooms</div>} />
        </Routes>
      </div>
      </ThemeProvider>
   
  );
}

export default App;