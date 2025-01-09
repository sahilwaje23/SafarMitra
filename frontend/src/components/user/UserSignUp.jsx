import React, { useState, useRef } from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Button,
  TextField,
  FormControl,
  useTheme
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const UserSignUp = () => {
  const theme = useTheme();
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const [gender, setGender] = useState("");
  const [aadhar, setAadhar] = useState();
  const [id, setId] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form logic
  };

  const handleFileChange = (setter) => (e) => {
    if (e.target.files[0]) setter(e.target.value);
  };

  const inputStyles = {
    input: { color: theme.palette.text.primary },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: theme.palette.text.primary },
      "&:hover fieldset": { borderColor: theme.palette.text.primary },
      "&.Mui-focused fieldset": { borderColor: theme.palette.text.primary },
    },
    "& .MuiInputLabel-root": { color: theme.palette.text.primary },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.text.primary },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        gap: "0.6rem",
        width: "100%",
        height: { xs: "100%", sm: "100vh", lg: "auto" },
        backgroundColor: theme.palette.background.default,
        padding: "1rem",
        backdropFilter: "blur(10px)",
        px: "1.2rem",
      }}
    >
      <Button
        size="large"
        sx={{
          alignSelf: "start",
          fontSize: "1.3rem",
          paddingLeft: "0px",
          fontFamily: theme.typography.h4.fontFamily,
          fontWeight: theme.typography.h4.fontWeight,
          color: theme.palette.primary.main,
        }}
        onClick={() => navigate(-1)}
      >
        &lt; Back
      </Button>

      <Typography
        variant="h4"
        sx={{
          fontWeight: theme.typography.h3.fontWeight,
          color: theme.palette.primary.main,
          marginTop: "2rem",
          fontFamily: theme.typography.fontFamily,
        }}
      >
        Sign up
      </Typography>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-[15px] w-full"
      >
        <FormControl fullWidth>
          <TextField
            label="Full Name"
            variant="outlined"
            sx={inputStyles}
            name="fullName"
            inputRef={nameRef}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Email"
            variant="outlined"
            sx={inputStyles}
            name="email"
            inputRef={emailRef}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            sx={inputStyles}
            name="password"
            inputRef={passwordRef}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel sx={{ color: theme.palette.text.primary }}>Gender</InputLabel>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            sx={{
              color: theme.palette.text.primary,
              backgroundColor: "transparent",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.primary,
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.primary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.text.primary,
              },
              "& .MuiSvgIcon-root": {
                color: theme.palette.text.primary,
              },
            }}
            name="gender"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Mobile Number"
          variant="outlined"
          type="tel"
          inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
          sx={inputStyles}
          name="mobileNo"
        />

        <FormControl fullWidth>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: 'transparent',
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.text.primary}`,
              borderRadius: '4px',
            }}
          >
            <Typography
              sx={{
                width: '35%',
                fontSize: '1rem',
                padding: '0.75rem 0.5rem',
                display: 'flex',
                alignItems: 'center',
                borderRight: `1px solid ${theme.palette.text.primary}`,
              }}
            >
              Upload ID
            </Typography>
            <input
              type="file"
              accept=".png"
              onChange={handleFileChange(setId)}
              style={{
                width: '65%',
                padding: '0.5rem',
                color: theme.palette.text.primary,
                cursor: 'pointer',
              }}
            />
          </Box>
        </FormControl>

        <Button sx={{ height: "3.3rem" }} variant="contained" type="submit">
          <Typography sx={{ fontSize: "large", fontWeight: "700" }}>Sign up</Typography>
        </Button>

        <Typography
          sx={{ textAlign: "right", color: theme.palette.text.primary, width: "100%" }}
        >
          Already have an account?{" "}
          <Link to="/user-signin" className="font-bold text-[#FEC400]">
            Sign In
          </Link>
        </Typography>
      </form>
    </Box>
  );
};

export default UserSignUp;