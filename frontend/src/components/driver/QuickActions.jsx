import React, { useState } from 'react';
import { Box, Switch, Typography, Paper } from '@mui/material';
import theme from '../../styles/theme';
import axios from 'axios';

const QuickActions = ({ status, setStatus }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    const newStatus = status === "ONLINE" ? "OFFLINE" : "ONLINE";
    console.log("naya status", newStatus)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/driver/toggle-status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          withCredentials: true,
        }
      );
      setStatus(res.data.status);
    } catch (err) {
      console.error("Failed to toggle status", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 2,  bgcolor: theme.palette.mode === 'dark' 
      ? 'rgba(18, 18, 18, 0.6)' 
      : 'rgba(255, 255, 255, 0.6)', }}>
      <Typography variant="h6" gutterBottom>Quick Actions</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography>Status:</Typography>
        <Switch
          checked={status === "ONLINE"}
          onChange={handleToggle}
          disabled={loading}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': {
              color: theme.palette.primaryColor.main
            },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: theme.palette.primaryColor.main
            }
          }}
        />
        <Typography>{status}</Typography>
      </Box>
    </Paper>
  );
};

export default QuickActions;