import React from "react";
import { useRef , useState} from "react";
import {Box,InputLabel,MenuItem,Select,Typography,Button,TextField,FormControl,
} from "@mui/material";
import { Link, Navigate, useNavigate } from "react-router-dom";


const UserSignIn = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    // axios code for sending data
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "0.6rem",
        width: "100%",
        height: { xs: "100%", sm: "100vh" },
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: "1rem",
        backdropFilter: "blur(10px)",
        px: "1.2rem",
      }}
    >
      {/* Back Button - useNavigate here for go back*/}
      <Button
        size="large"
        sx={{ alignSelf: "start", fontSize: "1rem", paddingLeft: "0px" }}
        onClick={() => navigate(-1)} // back button functionality.
      >
        &lt; Back
      </Button>

      {/* signup text heading */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "white", marginTop: "2rem" }}
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
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "lightgray" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiInputLabel-root.Mui-focused": { color: "white" },
            }}
            ref={emailRef}
            name="email"
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
              input: { color: "white" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "white" },
                "&:hover fieldset": { borderColor: "lightgray" },
                "&.Mui-focused fieldset": { borderColor: "white" },
              },
              "& .MuiInputLabel-root": { color: "white" },
              "& .MuiInputLabel-root.Mui-focused": { color: "white" },
            }}
            ref={passwordRef}
            name="password"
          />
        </FormControl>


        {/* Sign Up Button */}
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
