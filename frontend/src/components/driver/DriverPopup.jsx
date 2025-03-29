// sahil's file

import React from "react";
import { Box, Button, Typography, Avatar } from "@mui/material";

const DriverPopup = () => {
  return (
    <Box
      component="section"
      sx={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        height: "50vh",
        bgcolor: "#333639",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.2)",
        p: 3,
      }}
    >
      {/* Fare */}
      {/* <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: "#FEC400",
          p: 1,
          borderRadius: 4,
        }}
      >
        ₹250
      </Typography> */}

      {/* Creator Info Box */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#FCCC2D",
          p: 2,
          borderRadius: 8,
          mb: 3,
        }}
      >
        {/* Circular Avatar */}
        <Avatar
          src="https://via.placeholder.com/50"
          alt="Creator"
          sx={{ width: 56, height: 56, mr: 2 }}
        />
       <Box
  sx={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensures the Box spans the full width
  }}
>
  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
    Shaurya Rajput
  </Typography>
  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
    2.5 km
  </Typography>
</Box>

      </Box>


<Box sx={{display:"flex",flexDirection:"column",gap:"2vw"}}>
{/* box for showing the pickup point */}


<Box >
  <Box sx={{width:"12px"}}>
    <img src="start.png" alt="" />
  </Box>

<Box

sx={{background:"",padding:"2px", borderRadius:"2px",borderBottom:"1px solid white"}}

>


  <Typography  sx={{color:"white"}}>VJTI</Typography>
  <Typography  sx={{color:"white"}}>Mahajani Road</Typography>
</Box>
</Box>

{/* Box for destination  */}
<Box

sx={{ background:"",padding:"2px",borderRadius:"2px",borderBottom:"1px solid white",mb:3}}>

<Typography sx={{color:"white"}}>Dadar Railway Station</Typography>
<Typography  sx={{color:"white"}}>Dadar </Typography>

</Box>


</Box>





      {/* Distance */}
      {/* <Typography variant="body2" sx={{ mb: 3, color: "gray" }}>
        Distance: 2.5 km
      </Typography> */}

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="success"
          sx={{ flex: 1 }}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ flex: 1 }}
        >
          Reject
        </Button>
      </Box>
    </Box>
  );
};

export default DriverPopup;
