import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline} from "@mui/material";
import { CaptainHomePage, CaptainSignIn, CaptainSignUp, Landing, UserHomePage, UserSignIn, UserSignUp } from './components';
import Navbar from './components/navbar/Navbar';
import theme from './styles/theme';

function App() {
  const location = useLocation();
  const type = location.pathname.startsWith('/captain-') ? 'captain' : 'user';
  const isMobileView = window.innerWidth <= 600;

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div style={{ 
      paddingBottom: isMobileView ? '56px' : '0',
      paddingTop: !isMobileView ? '64px' : '0' // Add top padding for desktop navbar  
    }}>
        <Routes>
          <Route path='/' element={<UserHomePage />} />
          <Route path='/user-signup' element={<UserSignUp />} />
          <Route path='/user-signin' element={<UserSignIn />} />
          <Route path='/captain-signup' element={<CaptainSignUp />} />
          <Route path='/captain-signin' element={<CaptainSignIn />} />
          <Route path='/user-homepage' element={<UserHomePage />} />
          <Route path='/captain-homepage' element={<CaptainHomePage />} />
          {/* <Route path='/user-history' element={<div>User History</div>} />
          <Route path='/user-profile' element={<div>User Profile</div>} />
          <Route path='/create-room' element={<div>Create Room</div>} />
          <Route path='/join-room' element={<div>Join Room</div>} />
          <Route path='/captain-history' element={<div>Captain History</div>} />
          <Route path='/captain-earnings' element={<div>Earnings</div>} />
          <Route path='/captain-profile' element={<div>Captain Profile</div>} />
          <Route path='/captain-nearby-rooms' element={<div>Nearby Rooms</div>} /> */}
        </Routes>
      </div>
      <Navbar type={type} />
    </ThemeProvider>   
  );
}

export default App;