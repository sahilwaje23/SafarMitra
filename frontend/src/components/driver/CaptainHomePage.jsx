import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import QuickActions from './QuickActions'; // Assuming the component is renamed without 'Captain'
import Dashboard from './Dashboard'; // Assuming the component is renamed without 'Captain'
import Map from '../map/Map';
import Room from '../room/Room';
import theme from '../../styles/theme.js'; // Correct relative path for styles folder

const CaptainHomePage = () => {
  const isMobile = useMediaQuery('(max-width:1024px)');

  const MobileView = () => (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2, 
      p: 2,
      height:'90vh',
      minHeight: '100vh',
      pb: '64px', // Account for bottom navigation
      bgcolor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.3)' 
        : 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)'
    }}>
      <QuickActions />
      <Dashboard />
      <Map />
      <Room />
    </Box>
  );

  const DesktopView = () => (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      p: 0.5, 
      height: '100vh',
      pt: '0.4rem', // Account for top navigation
      bgcolor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.3)' 
        : 'rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
      
    }}>
      {/* Left Section - Map Only */}
      <Box sx={{ flex: 2,
      //overflow: 'auto' 
      height: '100%',
     // border: '0.5rem outset pink',

      }}>
      <Map sx={{ 
        // position: 'absolute', // Add this
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
       // border: '0.5rem outset green',
        height: 'auto',
        width: '100%'
      }} />
      </Box>
      
      {/* Right Section - Actions, Dashboard, Room */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflow: 'auto' }}>
        <QuickActions />
        <Dashboard />
        <Room sx={{ flex: 1 }} />
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? <MobileView /> : <DesktopView />}
    </>
  );
};

export default CaptainHomePage;