import React, { useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const UserSignIn = () => {
  const theme = useTheme();
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("UserSignIn component theme: ", theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for sending data (e.g., axios request)
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "1rem",
        width: "100%",
        height: { xs: "100%", sm: "100vh" },
        backgroundColor: theme.palette.background.default,
        padding: "1.5rem",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Back Button */}
      <Button
        size="large"
        sx={{
          alignSelf: "start",
          fontSize: "1.3rem",
          paddingLeft: 0,
          fontFamily: theme.typography.h4.fontFamily,
          fontWeight: theme.typography.h4.fontWeight,
          color: theme.palette.primary.main,
        }}
        onClick={() => navigate(-1)}
      >
        &lt; Back
      </Button>

      {/* Heading */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: theme.typography.h3.fontWeight,
          color: theme.palette.primary.main,
          marginTop: "2rem",
        }}
      >
        Sign In
      </Typography>

      {/* Form Content */}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}
      >
        {/* Email Field */}
        <FormControl fullWidth>
          <TextField
            id="outlined-email"
            label="Email"
            variant="outlined"
            inputRef={emailRef}
            name="email"
            fullWidth
          />
        </FormControl>

        {/* Password Field */}
        <FormControl fullWidth>
          <TextField
            id="outlined-password"
            label="Password"
            variant="outlined"
            type="password"
            inputRef={passwordRef}
            name="password"
            fullWidth
          />
        </FormControl>

        {/* Sign In Button */}
        <Button
          variant="contained"
          type="submit"
          sx={{
            height: "3.3rem",
            backgroundColor: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.primary.dark },
          }}
        >
          <Typography sx={{ fontSize: "large", fontWeight: "700" }}>
            Sign In
          </Typography>
        </Button>

        {/* Sign Up Redirect */}
        <Typography
          sx={{ textAlign: "right", width: "100%", color: theme.palette.text.secondary }}
        >
          Don’t have an account?{" "}
          <Link to="/user-signup" style={{ fontWeight: "bold", color: theme.palette.secondary.main }}>
            Sign Up
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default UserSignIn;
