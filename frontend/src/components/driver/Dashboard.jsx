import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import theme from '../../styles/theme';

const Dashboard = () => {
  return (
    <Paper sx={{ 
      p: 2, 
      bgcolor: theme.palette.mode === 'dark' 
        ? 'rgba(18, 18, 18, 0.6)' 
        : 'rgba(255, 255, 255, 0.6)',
      backdropFilter: 'blur(10px)',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000'
    }}>
      <Typography variant="h6" gutterBottom>Dashboard</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2">Today's Rides</Typography>
          <Typography variant="h5">5</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Earnings</Typography>
          <Typography variant="h5">₹500</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Rating</Typography>
          <Typography variant="h5">4.8</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default Dashboard;