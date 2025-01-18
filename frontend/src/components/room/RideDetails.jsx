import React from 'react'
import { Typography,Paper } from '@mui/material'
import theme from '../../styles/theme'
function RideDetails() {
  return (
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
  )
}

export default RideDetails
