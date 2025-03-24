import React, { useState } from 'react';
import { Box, IconButton, Paper, Typography, Button } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
// import Chat from './Chat'; // Assuming Chat is a separate component
// import RideDetails from './RideDetails'; // Assuming RideDetails is a separate component
import theme from '../../styles/theme';
import { useRoom } from '../../contexts/RoomContext';
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

const Popup = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const {
    pickup,
    destination,
    status,
  } = useRoom();
  return (
    <div>pop here</div>
    // <Box
    //   sx={{
    //     position: 'sticky',
    //     bottom: isExpanded ? 0 : '10%',
    //     left: 0,
    //     right: 0,
    //     //zIndex: 1,
    //     display: 'flex',
    //     flexDirection: 'column',
    //     transition: 'bottom 0.3s ease',
    //     //    border:'1rem solid red',
    //     height: '100%',
    //     gap: '1rem',
    //   }}
    // >
    //   <Paper
    //     elevation={2}
    //     sx={{
    //       //   position:'relative',
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //       justifyContent: 'space-between',
    //       bgcolor: theme.palette.tbgcolor,
    //       //   backdropFilter: 'blur(10px)',
    //       borderTopLeftRadius: 16,
    //       borderTopRightRadius: 16,
    //       boxShadow: 3,
    //       padding: '0.4rem 0.6rem 0rem',
    //       bottom: '0',
    //       //   gap:'2rem',
    //       //   pb: '3rem',
    //       height: '100%',
    //       //   border:'2rem solid green',

    //     }}
    //   >
    //     {/* Expand/Collapse Icon */}
    //     <IconButton
    //       sx={{
    //         position: 'absolute',
    //         top: -20,
    //         left: '50%',
    //         transform: 'translateX(-50%)',
    //         bgcolor: theme.palette.primaryColor.main,
    //         color: theme.palette.txtcol,
    //         '&:hover': {
    //           bgcolor: theme.palette.primaryColor.hover,
    //         },
    //       }}
    //       onClick={() => setIsExpanded((prev) => !prev)}
    //     >
    //       {isExpanded ? <ExpandLess /> : <ExpandMore />}
    //     </IconButton>

    //     {/* Popup Content */}
    //     <Box
    //       sx={{
    //         // position:'relative',
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         width: '100%',
    //         height: isExpanded ? '70vh' : '18vh',
    //         // height:'100%',
    //         maxHeight: isExpanded ? '90vh' : '18vh',
    //         overflowY: isExpanded ? 'auto' : 'hidden',
    //         transition: 'max-height 0.3s ease',
    //         // mb:0,
    //         gap: '1rem',
    //         boxSizing: 'border-box',
    //         // border:'1rem solid blue',
    //         // This ensures the container fills the screen
    //       }}
    //     >
    //       {/* Ride Info */}
    //       <Box
    //         sx={{
    //           mb: 2,
    //           display: 'flex',
    //           justifyContent: 'space-between',
    //           alignItems: 'center',
    //           width: '100%',
    //           px: 2,
    //           gap: '1rem',
    //           //   border:'1rem solid purple',
    //         }}
    //       >
    //         <Box>
    //           <Typography
    //             sx={{
    //               mb: 1,
    //               marginLeft: "1rem",
    //               '& span': {
    //                 color: theme.palette.secondaryColor.main
    //               }
    //             }}
    //           >
    //             Source:{" "}
    //             <Box component="span">
    //               {pickup || "CSMT"}
    //             </Box>
    //           </Typography>

    //           <Typography
    //             sx={{
    //               mb: 2,
    //               marginLeft: "1rem",
    //               '& span': {
    //                 color: theme.palette.secondaryColor.main
    //               }
    //             }}
    //           >
    //             Destination:{" "}
    //             <Box component="span">
    //               {destination || "Kalyan"}
    //             </Box>
    //           </Typography>
    //         </Box>
    //         <Typography variant="subtitle1">
    //           Status: <span style={{ color: theme.palette.primaryColor.main }}>{status}</span>
    //         </Typography>
    //       </Box>

    //       {/* Button Group */}
    //       <ButtonGroup isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeTab={activeTab} setActiveTab={setActiveTab} />

    //       {/* Active Tab Content */}
    //       <Box sx={{
    //         //  border:'1px solid green',
    //         width: '100%', px: 2
    //       }}>
    //         {activeTab === 'details' && <RideDetails />}
    //         {activeTab === 'chat' && <Chat />}
    //       </Box>
    //     </Box>
    //   </Paper>
    // </Box>
  );
};

export default Popup;