import React, { useState } from 'react';
import { Box, Switch, Typography, Paper } from '@mui/material';
import theme from '../../styles/theme';

const QuickActions = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Paper sx={{ p: 2,  bgcolor: theme.palette.mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.6)' 
      : 'rgba(255, 255, 255, 0.6)', }}>
      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography>Status:</Typography>
        <Switch
          checked={isActive}
          onChange={() => setIsActive(!isActive)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: theme.palette.primaryColor.main
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: theme.palette.primaryColor.main
            }
          }}
        />
        <Typography>{isActive ? 'Active' : 'Inactive'}</Typography>
      </Box>
    </Paper>
  );
};

export default QuickActions;