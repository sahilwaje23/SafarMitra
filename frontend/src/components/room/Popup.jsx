import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Chat from './Chat'; // Assuming Chat is a separate component
import RideDetails from './RideDetails'; // Assuming RideDetails is a separate component
import theme from '../../styles/theme';
<<<<<<< HEAD

const ButtonGroup = ({ activeTab, setActiveTab,isExpanded,setIsExpanded}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        onClick={() =>{
            setIsExpanded(true)
            setActiveTab('details')}}
=======
import { useLocations } from '../../contexts/LocationsContext';

const ButtonGroup = ({ activeTab, setActiveTab, isExpanded, setIsExpanded }) => {
  const { pickupLat, pickupLng, dropLat, dropLng, pickupText, dropText } = useLocations();
  
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button 
        onClick={() => {
          setIsExpanded(true);
          setActiveTab('details');
        }}
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
        sx={{
          bgcolor: activeTab === 'details' ? theme.palette.primaryColor.main : 'transparent',
          color: activeTab === 'details' ? theme.palette.txtcol : theme.palette.primaryColor.main,
          border: `1px solid ${theme.palette.primaryColor.main}`,
          py: 1.5,
          px: 4,
          borderRadius: '1rem',
          fontWeight: 'bold',
<<<<<<< HEAD
          outline: 'none', // Removes the focus outline
=======
          outline: 'none',
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
          '&:hover': {
            bgcolor: activeTab === 'details' ? theme.palette.primaryColor.hover : 'rgba(254, 196, 0, 0.1)',
          },
        }}
      >
        Ride Details
      </Button>
<<<<<<< HEAD
      <Button
         onClick={() =>{
            setIsExpanded(true)
            setActiveTab('chat')}}
=======

      <Button
        onClick={() => {
          setIsExpanded(true);
          setActiveTab('chat');
        }}
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
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

const Popup = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [status, setStatus] = useState('unconfirmed');

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
<<<<<<< HEAD
    //    border:'1rem solid red',
        height:'100%',
        gap:'1rem',
      }}
    >
      <Paper
      elevation={2}
        sx={{
        //   position:'relative',
=======
        //    border:'1rem solid red',
        height: '100%',
        gap: '1rem',
      }}
    >
      <Paper
        elevation={2}
        sx={{
          //   position:'relative',
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: theme.palette.tbgcolor,
<<<<<<< HEAD
        //   backdropFilter: 'blur(10px)',
=======
          //   backdropFilter: 'blur(10px)',
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: 3,
          padding: '0.4rem 0.6rem 0rem',
<<<<<<< HEAD
          bottom:'0',
        //   gap:'2rem',
        //   pb: '3rem',
         height:'100%',
        //   border:'2rem solid green',
    
=======
          bottom: '0',
          //   gap:'2rem',
          //   pb: '3rem',
          height: '100%',
          //   border:'2rem solid green',

>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
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
<<<<<<< HEAD
            height:isExpanded?'70vh':'18vh',
=======
            height: isExpanded ? '70vh' : '18vh',
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
            // height:'100%',
            maxHeight: isExpanded ? '90vh' : '18vh',
            overflowY: isExpanded ? 'auto' : 'hidden',
            transition: 'max-height 0.3s ease',
            // mb:0,
<<<<<<< HEAD
            gap:'1rem',
            boxSizing: 'border-box',
            // border:'1rem solid blue',
             // This ensures the container fills the screen
=======
            gap: '1rem',
            boxSizing: 'border-box',
            // border:'1rem solid blue',
            // This ensures the container fills the screen
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
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
<<<<<<< HEAD
              gap:'1rem',
            //   border:'1rem solid purple',
=======
              gap: '1rem',
              //   border:'1rem solid purple',
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
            }}
          >
            <Box>
              <Typography variant="subtitle1">
<<<<<<< HEAD
                Pickup: <span style={{ color: theme.palette.primaryColor.main }}>DADAR</span>
=======
                Pickup: <span style={{ color: theme.palette.primaryColor.main }}>Dadar</span>
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
              </Typography>
              <Typography variant="subtitle1">
                Destination: <span style={{ color: theme.palette.primaryColor.main }}>VJTI</span>
              </Typography>
            </Box>
            <Typography variant="subtitle1">
              Status: <span style={{ color: theme.palette.primaryColor.main }}>{status}</span>
            </Typography>
          </Box>

          {/* Button Group */}
          <ButtonGroup isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Active Tab Content */}
          <Box sx={{
            //  border:'1px solid green',
<<<<<<< HEAD
            width: '100%', px: 2 }}>
          {activeTab === 'details' && <RideDetails />}
=======
            width: '100%', px: 2
          }}>
            {activeTab === 'details' && <RideDetails />}
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
            {activeTab === 'chat' && <Chat />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Popup;