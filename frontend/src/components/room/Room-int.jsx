// - modes for room are `unconfirmed,locked,accepted,running,finished`
// - suggested to use numbers to represent statuses enables for efficient communication as in the frontend corresponding to the number we display that particular status
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, useMediaQuery ,Paper} from '@mui/material';
import Map from '../map/Map';
import Chat from './Chat'
import theme from '../../styles/theme';
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


function MobileView() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [status, setStatus] = useState('unconfirmed');

  return (
    <Box sx={{ height: '100vh', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Map Covering the Full Screen */}
      <Box sx={{ width: '100%', height: '100%' }}>
        <Map />
      </Box>

      {/* Popup Section */}
      <Paper sx={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        maxHeight: isExpanded ? '90vh' : '30vh',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        backdropFilter: 'blur(10px)',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        transition: 'max-height 0.3s ease-in-out', // Smooth transition
      }}>
        <Box sx={{ padding: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Upper Section: Source, Destination, and Status */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ mb: 1 }}>
                Pickup: <span style={{ color: theme.palette.primaryColor.main }}>DADAR</span>
              </Typography>
              <Typography>
                Destination: <span style={{ color: theme.palette.primaryColor.main }}>VJTI</span>
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography sx={{ color: theme.palette.primaryColor.main }}>
                Status: {status}
              </Typography>
            </Box>
          </Box>

          {/* Lower Section: Buttons for "Room Detail" and "Chat" */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setActiveTab('details')}
              sx={{
                bgcolor: theme.palette.primaryColor.main,
                color: 'black',
                py: 1.5,
                borderRadius: '24px',
                fontWeight: 'bold',
              }}
            >
              Room Detail
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setActiveTab('chat')}
              sx={{
                bgcolor: theme.palette.primaryColor.main,
                color: 'black',
                py: 1.5,
                borderRadius: '24px',
                fontWeight: 'bold',
              }}
            >
              Chat
            </Button>
          </Box>
        </Box>

        {/* Show Room Details or Chat based on active tab */}
        {isExpanded && activeTab === 'chat' ? (
          <Box sx={{ height: "70%", overflowY: 'auto' }}>
            <Chat />
          </Box>
        ) : isExpanded && activeTab === 'details' ? (
            <Paper elevation={2} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 ,display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Driver Details</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Journey Details</Typography>
            </Paper>
        ) : null}
      </Paper>
    </Box>
  );
}


function DesktopView() {
  const [activeTab, setActiveTab] = useState('details');
  const [status, setStatus] = useState('unconfirmed');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '') {
      setMessages([...messages, inputMessage]);
      setInputMessage('');
    }
  };
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '85vh',
      width: '99%',
      marginLeft:'0.1rem',
      margin: '0.5rem' ,// For navbar
      //border:'1rem solid hotpink',
      gap:'0.4rem'
    }}>
      <Box sx={{ flex: '60%', height: '90%',
        //border:'1px solid aqua',
        width:'70%',
       }}>
        <Map />
      </Box>
      <Paper sx={{
        flex: '40%',
        bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : 'rgba(255, 255, 255, 0.6)',
        display: 'flex',
        flexDirection: 'column',
        //border:'1px solid red',
        padding:'0.5rem',
        //paddingRight:'7rem',
        width:'90%',
        height:'100%',
        
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 3 ,
          marginRight:'0.8rem',
          gap:3,
          
        }}>
          <ButtonGroup activeTab={activeTab} setActiveTab={setActiveTab} />
          <Typography sx={{ color: theme.palette.primaryColor.main }}>
            Status : {status}
          </Typography>
        </Box>
        {activeTab === 'chat' ? (
            <Box
            sx={{
              height: "75%", // Control height of the chat container
              maxHeight: "75%", // Max height, you can adjust this as needed
              overflowY: "auto", // Make it scrollable if content overflows
            }}
          >
            <Chat />
          </Box>
          ) : (
          <>
            <Typography sx={{ mb: 1,marginLeft:'1rem' }}>
              Source : <span style={{ color: theme.palette.primaryColor.main }}>DADAR STN</span>
            </Typography>
            <Typography sx={{ mb: 2,marginLeft:'1rem' }}>
              Destination : <span style={{ color: theme.palette.primaryColor.main }}>VJTI</span>
            </Typography>
            <Paper elevation={2} sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2 ,display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Driver Details</Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Journey Details</Typography>
            </Paper>
          </>
        )}
      </Paper>
    </Box>
  );
}

function RoomInt() {
  const isMobile = useMediaQuery('(max-width:1024px)');
  return isMobile ? <MobileView /> : <DesktopView />;
}

export default RoomInt;