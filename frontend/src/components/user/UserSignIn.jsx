import React from "react";
import { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import theme from "../../styles/theme";
import axios from 'axios';


const UserSignIn = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/login', {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    },{withCredentials: true})
    .then((res) => {
      console.log(res)
      if(res.status === 200){
        alert("sign in successful");
        navigate('/user-homepage');
      }
    })
    .catch((e) => {
      // console.log(e.data.err);
      // alert(e.data.err) 
      alert("email or password is incorrect");
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "0.6rem",
          width: "100%",
          maxWidth: { md: "40%" ,sm: '75%'},
          minHeight: '100vh',
          height: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          padding: "1rem",
          backdropFilter: "blur(10px)",
          px: "1.2rem",
      }}
    >
      {/* Back Button - useNavigate here for go back */}
      <Button
        size="large"
        sx={{ alignSelf: "start", fontSize: "1.3rem", paddingLeft: "0px" , fontFamily: theme.typography.h4.fontFamily, fontWeight: theme.typography.h4.fontWeight, color: theme.palette.primary.main,display: {md:'none'} }}
        onClick={() => navigate(-1)} // back button functionality.
      >
        &lt; Back
      </Button>

      {/* signup text heading */}
      <Typography
        variant="h4"
        sx={{ color: theme.palette.primary.main, marginTop: "2rem" ,fontFamily: theme.typography.fontFamily, fontWeight: theme.typography.h3.fontWeight }}
        
      >
        Sign In
      </Typography>

      {/* Form Content */}
      <form
        className="flex flex-col gap-2 w-[100%] gap-y-[15px]"
        onSubmit={handleSubmit}
      >
        {/* Email TextField */}
        <FormControl sx={{ width: "100%" }}>
          <TextField
            id="outlined-email"
            label="Email"
            variant="outlined"
            fullWidth
            sx={{
              input: { color: theme.palette.background.light },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.background.light },
                "&:hover fieldset": { borderColor: theme.palette.background.light },
                "&.Mui-focused fieldset": { borderColor: theme.palette.background.light },
              },
              "& .MuiInputLabel-root": { color: theme.palette.background.light },
              "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.background.light },
            }}
            inputRef={emailRef}
            name="email"
            required
          />
        </FormControl>

        {/* Password TextField */}
        <FormControl sx={{ width: "100%" }}>
          <TextField
            id="outlined-password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            sx={{
              input: { color: theme.palette.background.light },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.background.light },
                "&:hover fieldset": { borderColor: theme.palette.background.light },
                "&.Mui-focused fieldset": { borderColor: theme.palette.background.light },
              },
              "& .MuiInputLabel-root": { color: theme.palette.background.light },
              "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.background.light },
            }}
            inputRef={passwordRef}
            name="password"
            required
          />
        </FormControl>

        {/* Sign In Button */}
        <Button
          sx={{ height: "3.3rem" }}
          variant="contained"
          type="submit"
        >
          <Typography sx={{ fontSize: "large", fontWeight: "700" }}>
            Sign In
          </Typography>
        </Button>
        <div className="text-right text-white w-[100%] pr-2">
          <span>
            Don't have an account?{" "}
            <Link to="/user-signup" className="font-bold text-[#FEC400]">
              Sign Up
            </Link>
          </span>
          {/* use Link or navigate here for routing to sign in page */}
        </div>
      </form>
    </Box>
  );
};

export default UserSignIn;