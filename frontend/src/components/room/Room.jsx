import React from 'react';
import { Paper, Typography, Box, Card, CardContent, useMediaQuery } from '@mui/material';
import theme from '../../styles/theme';

const Room = () => {
  const isMobile = useMediaQuery('(max-width:1024px)');
  
  const dummyRooms = Array(10).fill({
    id: 1,
    title: 'Room Title',
    members: '2/4',
    destination: 'VJTI Gate'
  });

  return (
    <Paper sx={{ 
      p: 2, 
      bgcolor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.6)' 
        : 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      height: isMobile ? '300px' : '100%', // Fixed height for mobile, flexible for desktop
      minHeight: isMobile ? '300px' : '20rem',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
      overflowY: 'auto'
    }}>
      <Typography variant="h6" gutterBottom>ROOM</Typography>
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        {dummyRooms.map((room, index) => (
          <Card key={index} sx={{
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(0, 0, 0, 0.2)' 
              : 'rgba(255, 255, 255, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h6">{room.title} #{index + 1}</Typography>
              <Typography variant="body2">Members: {room.members}</Typography>
              <Typography variant="body2">Destination: {room.destination}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Paper>
  );
};

export default Room;