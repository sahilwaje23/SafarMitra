import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, ButtonGroup, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import Chat from './Chat'; // Assuming Chat is a separate component
import RideDetails from './RideDetails'; // Assuming RideDetails is a separate component
import theme from '../../styles/theme'
const ButtonGroup = ({ activeTab, setActiveTab }) => {
 return(
  <Box sx={{ display: 'flex', gap: 2 }}>
    <Button
      onClick={() => setActiveTab('details')}
      sx={{
        bgcolor: activeTab === 'details' ? theme.palette.primaryColor.main : 'transparent',
        color: activeTab === 'details' ? theme.palette.txtcol : theme.palette.primaryColor.main,
        border: `1px solid ${theme.palette.primaryColor.main}`,
        py: 1.5,
        px:4,
        borderRadius: '1rem',
        fontWeight: 'bold',
        outline: 'none', // Removes the focus outline
        '&:hover': {
          bgcolor: activeTab === 'details' ? theme.palette.primaryColor.hover : 'rgba(254, 196, 0, 0.1)',
        },
      }}
    >
      Ride Details
    </Button>
    <Button
      onClick={() => setActiveTab('chat')}
      sx={{
        bgcolor: activeTab === 'chat' ? theme.palette.primaryColor.main : 'transparent',
        color: activeTab === 'chat' ? theme.palette.txtcol : theme.palette.primaryColor.main,
        border: `1px solid ${theme.palette.primaryColor.main}`,
        py: 1.5,
        px:4,
        borderRadius: '1rem',
        outline: 'none', // Removes the focus outline
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [status, setStatus] = useState('unconfirmed');

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: isExpanded ? 0 : '10%',
        left: 0,
        right: 0,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        transition: 'bottom 0.3s ease',
      }}
    >
      <Paper
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: theme.palette.tbgcolor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: 3,
          p: 2,
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxHeight: isExpanded ? '60vh' : '15vh',
            overflowY: isExpanded ? 'auto' : 'hidden',
            transition: 'max-height 0.3s ease',
          }}
        >
          {/* Ride Info */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Typography variant="subtitle1">
              Pickup: <span style={{ color: theme.palette.primaryColor.main }}>DADAR</span>
            </Typography>
            <Typography variant="subtitle1">
              Destination: <span style={{ color: theme.palette.primaryColor.main }}>VJTI</span>
            </Typography>
          </Box>

          {/* Button Group */}
          <ButtonGroup sx={{ mb: 2 }}>
            <Button
              variant={activeTab === 'details' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('details')}
            >
              Ride Details
            </Button>
            <Button
              variant={activeTab === 'chat' ? 'contained' : 'outlined'}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </Button>
          </ButtonGroup>

          {/* Active Tab Content */}
          <Box sx={{ width: '100%', px: 2 }}>
            {activeTab === 'details' && <RideDetails />}
            {activeTab === 'chat' && <Chat />}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Popup;
