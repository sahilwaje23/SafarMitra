import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Button, CircularProgress } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Chat from './Chat';
import RideDetails from './RideDetails';
import { useRoom } from '../../contexts/RoomContext';
import { useLocations } from '../../contexts/LocationsContext';
import { calculateETA } from '../../utils/eta';
import theme from '../../styles/theme';
const ButtonGroup = ({ activeTab, setActiveTab, isExpanded, setIsExpanded }) => {

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        onClick={() => {
          setIsExpanded(true);
          setActiveTab('details');
        }}
        sx={{
          bgcolor: activeTab === 'details' ? theme.palette.primaryColor.main : 'transparent',
          color: activeTab === 'details' ? theme.palette.txtcol : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: '1rem',
          fontWeight: 'bold',
          outline: 'none',
          '&:hover': {
            bgcolor: activeTab === 'details' ? theme.palette.primaryColor.hover : 'rgba(254, 196, 0, 0.1)',
          },
        }}
      >
        Ride Details
      </Button>

      <Button
        onClick={() => {
          setIsExpanded(true);
          setActiveTab('chat');
        }}
        sx={{
          bgcolor: activeTab === 'chat' ? theme.palette.primaryColor.main : 'transparent',
          color: activeTab === 'chat' ? theme.palette.txtcol : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: '1rem',
          fontWeight: 'bold',
          '&:hover': {
            bgcolor: activeTab === 'chat' ? theme.palette.primaryColor.hover : 'rgba(254, 196, 0, 0.1)',
          },
        }}
      >
        Chat
      </Button>
    </Box>
  );
};

const Popup = ({ isCreator, handleAssignDriver }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const {
    destination,
    status,
    otp
  } = useRoom();
  const { driverLocation, currentLocation, pickupLat, pickupLng, dropLat, dropLng } = useLocations();
  const [expandedPickup, setExpandedPickup] = useState(false);
  const [expandedDrop, setExpandedDrop] = useState(false);

  let dynamicEtaText = "";
  if (status === "accepted") {
    const lat1 = driverLocation?.lat || currentLocation?.[0];
    const lng1 = driverLocation?.lng || currentLocation?.[1];
    const eta = calculateETA(lat1, lng1, pickupLat, pickupLng);
    dynamicEtaText = `Pickup in ${eta} mins`;
  } else if (status === "ongoing") {
    const lat1 = driverLocation?.lat || currentLocation?.[0];
    const lng1 = driverLocation?.lng || currentLocation?.[1];
    const eta = calculateETA(lat1, lng1, dropLat, dropLng);
    dynamicEtaText = `Drop in ${eta} mins`;
  }
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: isExpanded ? 0 : '10%',
        left: 0,
        right: 0,
        //zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        transition: 'bottom 0.3s ease',
        //    border:'1rem solid red',
        height: '100%',
        gap: '1rem',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          //   position:'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: theme.palette.tbgcolor,
          //   backdropFilter: 'blur(10px)',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: 3,
          padding: '0.4rem 0.6rem 0rem',
          bottom: '0',
          //   gap:'2rem',
          //   pb: '3rem',
          height: '100%',
          //   border:'2rem solid green',

        }}
      >
        {/* Expand/Collapse Icon */}
        <IconButton
          sx={{
            position: 'absolute',
            top: -20,
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: theme.palette.primaryColor.main,
            color: theme.palette.txtcol,
            '&:hover': {
              bgcolor: theme.palette.primaryColor.hover,
            },
          }}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>

        {/* Popup Content */}
        <Box
          sx={{
            // position:'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            height: isExpanded ? '70vh' : '18vh',
            // height:'100%',
            maxHeight: isExpanded ? '90vh' : '18vh',
            overflowY: isExpanded ? 'auto' : 'hidden',
            transition: 'max-height 0.3s ease',
            // mb:0,
            gap: '1rem',
            boxSizing: 'border-box',
            // border:'1rem solid blue',
            // This ensures the container fills the screen
          }}
        >
          {/* Ride Info */}
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              px: 2,
              gap: '1rem',
              //   border:'1rem solid purple',
            }}
          >
            <Box>
              <Typography
                sx={{
                  mb: 1,
                  marginLeft: "1rem",
                  '& span': {
                    color: theme.palette.secondaryColor.main,
                    cursor: 'pointer',
                    display: expandedPickup ? 'block' : '-webkit-box',
                    WebkitLineClamp: expandedPickup ? 'none' : 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
                onClick={() => setExpandedPickup(!expandedPickup)}
              >
                Source:{" "}
                <Box component="span">
                  {pickup || "CSMT"}
                </Box>
              </Typography>

              <Typography
                sx={{
                  mb: 2,
                  marginLeft: "1rem",
                  '& span': {
                    color: theme.palette.secondaryColor.main,
                    cursor: 'pointer',
                    display: expandedDrop ? 'block' : '-webkit-box',
                    WebkitLineClamp: expandedDrop ? 'none' : 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }
                }}
                onClick={() => setExpandedDrop(!expandedDrop)}
              >
                Destination:{" "}
                <Box component="span">
                  {destination || "Kalyan"}
                </Box>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: theme.palette.primaryColor.main }}>
                {status === "open" && "Status: Open"}
                {status === "closed" && "Searching for driver..."}
                {status === "accepted" && dynamicEtaText}
                {status === "ongoing" && dynamicEtaText}
                {status === "completed" && "Journey completed"}
              </Typography>
              {status === "accepted" && otp && (
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.1)', px: 1, py: 0.5, borderRadius: 1, border: `1px solid ${theme.palette.primaryColor.main}` }}>
                  <Typography variant="caption" sx={{ color: theme.palette.txtcol, fontWeight: 'bold' }}>
                    OTP: <span style={{ color: theme.palette.primaryColor.main, letterSpacing: 1 }}>{otp}</span>
                  </Typography>
                </Box>
              )}
              {isCreator && status === "open" && (
                <Button
                  variant="contained"
                  onClick={handleAssignDriver}
                  sx={{
                    bgcolor: theme.palette.primaryColor.main,
                    color: theme.palette.txtcol,
                    '&:hover': {
                      bgcolor: theme.palette.primaryColor.hover,
                    },
                    padding: '4px 8px',
                    fontSize: '0.75rem',
                  }}
                >
                  Assign Driver
                </Button>
              )}
            </Box>
          </Box>

          {/* Button Group */}
          <ButtonGroup isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Active Tab Content */}
          <Box sx={{
            //  border:'1px solid green',
            width: '100%', px: 2
          }}>
            {activeTab === 'details' && <RideDetails />}
            {activeTab === 'chat' && <Chat />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Popup;