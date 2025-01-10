import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Home,
  History,
  Person,
  Room,
  LocationOn,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../../styles/theme';

const Navbar = ({ type }) => {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  const yellowTheme = theme.palette.primaryColor.main;

  const userNavItems = [
    { label: 'Home', icon: <Home />, path: '/user-homepage' },
    { label: 'Room Actions', icon: <Room />, path: '/room-actions' },
    { label: 'History', icon: <History />, path: '/user-history' },
    { label: 'Profile', icon: <Person />, path: '/user-profile' },
  ];

  const captainNavItems = [
    { label: 'Home', icon: <Home />, path: '/captain-homepage' },
    { label: 'Nearby Rooms', icon: <LocationOn />, path: '/nearby-rooms' },
    { label: 'History', icon: <History />, path: '/captain-history' },
    { label: 'Earnings', icon: <AttachMoney />, path: '/earnings' },
    { label: 'Profile', icon: <Person />, path: '/captain-profile' },
  ];

  const currentNavItems = type === 'user' ? userNavItems : captainNavItems;

  const handleRoomAction = () => {
    setOpenRoomDialog(true);
  };

  const handleNavigate = (path) => {
    if (path === '/room-actions') {
      handleRoomAction();
    } else {
      navigate(path);
    }
  };

  // // Desktop Navigation
  // const DesktopNav = () => (
  //   <AppBar position="static" color="default">
  //     <Toolbar>
  //       {currentNavItems.map((item) => (
  //         <Button
  //           key={item.label}
  //           startIcon={item.icon}
  //           onClick={() => handleNavigate(item.path)}
  //           sx={{
  //             color: location.pathname === item.path ? yellowTheme : 'inherit',
  //             mx: 2
  //           }}
  //         >
  //           {item.label}
  //         </Button>
  //       ))}
  //     </Toolbar>
  //   </AppBar>
  // );

  // // Mobile Navigation
  // const MobileNav = () => (
  //   <BottomNavigation
  //     value={value}
  //     onChange={(event, newValue) => {
  //       setValue(newValue);
  //       handleNavigate(currentNavItems[newValue].path);
  //     }}
  //     sx={{
  //       width: '100%',
  //       position: 'fixed',
  //       bottom: 0,
  //       borderTop: 1,
  //       borderColor: 'divider'
  //     }}
  //   >
  //     {currentNavItems.map((item) => (
  //       <BottomNavigationAction
  //         key={item.label}
  //         label={item.label}
  //         icon={item.icon}
  //         sx={{
  //           color: location.pathname === item.path ? yellowTheme : 'inherit'
  //         }}
  //       />
  //     ))}
  //   </BottomNavigation>
  // );
  const DesktopNav = () => (
    <AppBar 
      position="fixed" 
      sx={{
        backgroundColor: 'rgba(18, 18, 18, 0.6)', // dark mode color with opacity
        backdropFilter: 'blur(10px)',
        top: 0,
      }}
    >
      <Toolbar>
        {currentNavItems.map((item) => (
          <Button
            key={item.label}
            startIcon={item.icon}
            onClick={() => handleNavigate(item.path)}
            sx={{
              color: location.pathname === item.path ? theme.palette.primaryColor.main : 'inherit',
              mx: 2
            }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        handleNavigate(currentNavItems[newValue].path);
      }}
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: 'rgba(18, 18, 18, 0.6)',
        backdropFilter: 'blur(10px)'
      }}
    >
      {currentNavItems.map((item) => (
        <BottomNavigationAction
          key={item.label}
          label={item.label}
          icon={item.icon}
          sx={{
            color: location.pathname === item.path ? theme.palette.primaryColor.main : 'inherit'
          }}
        />
      ))}
    </BottomNavigation>
  );
  return (
    <>
      {isMobile ? <MobileNav /> : <DesktopNav />}
      
      {/* Room Actions Dialog */}
      <Dialog open={openRoomDialog} onClose={() => setOpenRoomDialog(false)}>
        <DialogTitle>Room Actions</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
            <Button 
              variant="contained" 
              onClick={() => navigate('/create-room')}
              sx={{ backgroundColor: yellowTheme }}
            >
              Create Room
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/join-room')}
              sx={{ backgroundColor: yellowTheme }}
            >
              Join Room
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoomDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;