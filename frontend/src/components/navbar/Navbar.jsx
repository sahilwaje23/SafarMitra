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
 // History,
  Person,
  Room,
  LocationOn,
  AttachMoney
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import theme from '../../styles/theme';
import { ArrowBack } from '@mui/icons-material';
import { IconButton } from '@mui/material';


const Navbar = ({ type }) => {
  const isMobile = useMediaQuery('(max-width:1024px)');
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const [openRoomDialog, setOpenRoomDialog] = useState(false);

  const yellowTheme = theme.palette.primaryColor.main;

  const userNavItems = [
    { label: 'Home', icon: <Home />, path: '/user-homepage' },
    //{ label: 'Room Actions', icon: <Room />, path: '/room-actions' },
   // { label: 'History', icon: <History />, path: '/user-history' },
    { label: 'Profile', icon: <Person />, path: '/user-profile' },
  ];

  const captainNavItems = [
    { label: 'Home', icon: <Home />, path: '/captain-homepage' },
    //{ label: 'Nearby Rooms', icon: <LocationOn />, path: '/captain-nearby-rooms' },
    //{ label: 'History', icon: <History />, path: '/captain-history' },
    //{ label: 'Earnings', icon: <AttachMoney />, path: '/captain-earnings' },
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

  const DesktopNav = () => (
    <AppBar
      position="fixed"
      sx={{

        backgroundColor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.6)' 
          : 'rgba(255, 255, 255, 0.9)',

        backdropFilter: 'blur(10px)',
        top: 0,
        '& .MuiBottomNavigationAction-root': {
          padding: '16px 0px',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          minWidth: '80px',
          '&.Mui-selected': {
            color: theme.palette.primaryColor.main
          }
        },
        '& .MuiBottomNavigationAction-label': {
          opacity: 1, // Force label visibility
          fontSize: '0.75rem',
          color: 'inherit',
          '&.Mui-selected': {
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }
        },
        '& .MuiSvgIcon-root': {
          color: 'inherit'
        }
      }}
    >
      <Toolbar sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        px: 4
      }}>
        {/* Logo and Back Button Section */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          width: '200px' // Adjust as needed
        }}>

          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#000' }}
          >
            <ArrowBack />
          </IconButton>
          <img
            draggable="false"
            src={theme.palette.mode === 'light' ? '/safarmitra-icod.svg' : '/safarmitra-icol.svg'}
            alt="safarmitra-logo"
            className="drop-shadow-xl"
            style={{
              width: "120px",
              userSelect: "none",
              cursor: "pointer"
            }}
            onClick={() => navigate('/')}
          />
        </Box>

        {/* Navigation Items Section */}
        <Box sx={{ display: 'flex', justifyContent: 'end', flex: 1 }}>
          {currentNavItems.map((item) => (
            <Button
              key={item.label}
              startIcon={item.icon}
              onClick={() => handleNavigate(item.path)}
              sx={{
                padding: '12px 8px',
                color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                '&.Mui-selected, &:hover': {
                  color: theme.palette.primaryColor.main
                },
                ...(location.pathname === item.path && {
                  color: theme.palette.primaryColor.main,
                  fontWeight: 'bold'
                }),
                mx: 1.5,
                fontSize: '0.875rem',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
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
        zIndex:3,
        width: '100%',
        position: 'fixed',
        bottom: 0,
        borderTop: 1,
        borderColor: 'divider',
        backgroundColor: theme.palette.mode === 'dark'
          ? 'rgba(18, 18, 18, 0.6)'
          : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        '& .MuiBottomNavigationAction-root': {
          padding: '16px 0px',
          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
          minWidth: '80px',
          '&.Mui-selected': {
            color: theme.palette.primaryColor.main
          }
        },
        '& .MuiBottomNavigationAction-label': {
          opacity: 1, // Force label visibility
          fontSize: '0.75rem',
          color: 'inherit',
          '&.Mui-selected': {
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }
        },
        '& .MuiSvgIcon-root': {
          color: 'inherit'
        }
      }}
    >
      {currentNavItems.map((item) => (
        <BottomNavigationAction
          key={item.label}
          label={item.label}
          icon={item.icon}
        />
      ))}
    </BottomNavigation>
  );

  return (
    <>
      {isMobile ? <MobileNav /> : <DesktopNav />}

      {/* Room Actions Dialog */}
      <Dialog sx={{
        display: 'flex', justifyContent: 'center', alignItems: 'center'
        , '& .MuiDialog-paper': {
          borderRadius: '16px', // Adjust for curved corners
          backgroundColor: theme.palette.mode === 'dark'
            ? 'rgba(1, 1, 1, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',     // Set the opacity for the dialog box
        },
      }} open={openRoomDialog} onClose={() => setOpenRoomDialog(false)}>
        <DialogTitle sx={{ alignSelf: 'center' }}>Room Actions</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, m: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/create-room')}
              sx={{ backgroundColor: yellowTheme, fontWeight: 'bold' }}
            >
              Create Room
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/join-room')}
              sx={{ backgroundColor: yellowTheme, fontWeight: 'bold' }}
            >
              Join Room
            </Button>
          </Box>
        </DialogContent>
        <DialogActions sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }} >
          <Button onClick={() => setOpenRoomDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;