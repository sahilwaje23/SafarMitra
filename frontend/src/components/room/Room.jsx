import React from 'react';
import { Paper, Typography } from '@mui/material';
import theme from '../../styles/theme';

const Room = () => {
  return (
    <Paper sx={{ 
      p: 2, 
      bgcolor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.6)' 
        : 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      minHeight: '20rem',
      //border: '0.5rem outset red',
      height: '100%',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000'
    }}>
      <Typography variant="h6">ROOM</Typography>
    </Paper>
  );
};

export default Room;