// chaning navbar color temprorary
import React from 'react'
import Grid from '@mui/material/Grid2'
import {Box} from '@mui/material'
import { Calculate, Fullscreen } from '@mui/icons-material'
const UserHomePage = () => {
  return (
    <>
      <Box
        sx={{
          // bgcolor:'white',
          // color:'black'
          height: "auto",
          paddingX: '1rem'
        }}
      >
        <Grid 
          sx={{
            // bgcolor:'white',
            height:'calc(100vh - 66px)',
            width: '100%',

          }}
        >
          <Grid 
          item
          xs={6}
          sx={{
            // bgcolor:'black',
          }}
          >
           smh 
          </Grid>
          <Grid 
          item
          xs={6}
          sx={{
            // bgcolor:'white',
          }}
          >item2 </Grid>
        </Grid>

      </Box>
    </>
  )
}

export default UserHomePage