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
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import theme from "../../styles/theme";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axios from "axios";

const UserSignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const [gender, setGender] = useState("");
  const navigate = useNavigate();
  const [aadhar, setAadhar] = useState();
  const [id, setId] = useState();
  // const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // on successful sign up. open dialog
    axios
      .post(
        "http://localhost:8000/signup",
        {
          fullName: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          mobileNo: phoneRef.current.value,
          gender: gender,
          profileImageUrl: aadhar,
          idImageUrl: id,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // for file upload (multer)
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.status === 201) {
          navigate("/user-homepage");
          console.log(res);
          alert("signed up successfully");
          // setIsSignedUp(true);
        }
      })
      .catch((e) => {
        console.log(e);
        console.log("error in catch");
        if (e.response.data.errors && e.response.data.errors.length > 0) {
          // if errors array -> if email not in .vjti.ac.in domain or pass less than 8 characters
          console.log(e.response.data.errors.length);
          alert(e.response.data.errors.map((error) => error.msg).join("\n"));
        } else {
          // duplicate error
          alert("Email or Phone number already exists");
        }
      });
  };

  const handleAadharFile = (e) => {
    console.log(e.target.files[0]);
    if (e.target.files[0]) {
      setAadhar(e.target.files[0]);
    }
  };

  const handleIdFile = (e) => {
    if (e.target.files[0]) {
      setId(e.target.files[0]);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          gap: "0.6rem",
          width: "100%",
          maxWidth: { md: "40%", sm: "75%" },
          minHeight: "100vh",
          height: "auto",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          padding: "1rem",
          backdropFilter: "blur(10px)",
          px: "1.2rem",
        }}
      >
        {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Signed up successfully!
          </Alert>
        </Snackbar> */}

        {/* Back Button - useNavigate here for go back */}
        <Button
          size="large"
          sx={{
            alignSelf: "start",
            fontSize: "1.3rem",
            paddingLeft: "0px",
            fontFamily: theme.typography.h4.fontFamily,
            fontWeight: theme.typography.h4.fontWeight,
            color: theme.palette.primary.main,
            height: "3.3rem",
            width: "auto",
            display: { md: "none" },
          }}
          onClick={() => navigate(-1)} // back button functionality.
        >
          &lt; Back
        </Button>

        {/* signup text heading */}
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.primary.main,
            marginTop: { sm: "2rem", md: "1rem" },
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.h3.fontWeight,
          }}
        >
          Sign up
        </Typography>

        {/* Form Content */}
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-[100%] gap-y-[15px]"
        >
          {/* Full Name TextField */}
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="outlined-full-name"
              label="Full Name"
              variant="outlined"
              fullWidth
              sx={{
                input: { color: theme.palette.background.light },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: theme.palette.background.light },
                  "&:hover fieldset": {
                    borderColor: theme.palette.background.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.background.light,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.background.light,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.background.light,
                },
              }}
              name="fullName"
              inputRef={nameRef}
              // required
            />
          </FormControl>

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
                  "&:hover fieldset": {
                    borderColor: theme.palette.background.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.background.light,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.background.light,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.background.light,
                },
              }}
              inputRef={emailRef}
              name="email"
              // required
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
                  "&:hover fieldset": {
                    borderColor: theme.palette.background.light,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.background.light,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.background.light,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.background.light,
                },
              }}
              inputRef={passwordRef}
              name="password"
              // required
            />
          </FormControl>

          {/* Gender Select */}
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                color: theme.palette.background.light,
                "&.Mui-focused": {
                  color: theme.palette.background.light, // Ensure it stays primary color when focused
                },
              }}
            >
              Gender
            </InputLabel>
            <Select
              labelId="gender"
              id="gender"
              label="Gender"
              sx={{
                color: theme.palette.background.light,
                backgroundColor: "transparent",
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.background.light, // Primary border
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.background.light,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.background.light,
                },
                "& .MuiSvgIcon-root": {
                  color: theme.palette.background.light, // Primary dropdown arrow
                },
              }}
              value={gender}
              name="gender"
              // required
              onChange={(e) => setGender(e.target.value)}
            >
              <MenuItem value={"Male"}>male</MenuItem>
              <MenuItem value={"Female"}>female</MenuItem>
            </Select>
          </FormControl>

          {/* Mobile number */}
          <TextField
            label="Mobile Number"
            variant="outlined"
            fullWidth
            type="tel" // numeric keyboard on click on mobile
            inputProps={{
              maxLength: 10, // max 10 number
              pattern: "[0-9]*", // Ensure numeric input
            }}
            sx={{
              input: { color: theme.palette.background.light },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.background.light },
                "&:hover fieldset": {
                  borderColor: theme.palette.background.light,
                },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.background.light,
                },
              },
              "& .MuiInputLabel-root": {
                color: theme.palette.background.light,
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.background.light,
              },
            }}
            inputRef={phoneRef}
            name="mobileNo"
            // required
          />

          {/* Aadhar */}
          <div className="bg-transparent text-white border-white rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-2 py-3 flex justify-left items-center pl-3">
              Upload Aadhar
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md text-white cursor-pointer"
              accept=".png"
              type="file"
              id="file-input"
              // required
              onChange={handleAadharFile}
            />
          </div>

          {/* College ID */}
          <div className="bg-transparent text-white border-white rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-2 py-3 flex justify-left items-center pl-3">
              Upload Id
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md bg-transparent text-white cursor-pointer"
              accept=".png"
              type="file"
              id="id-input"
              // required
              onChange={handleIdFile}
            />
          </div>

          {/* Sign Up Button */}
          <Button sx={{ height: "3.3rem" }} variant="contained" type="submit">
            <Typography sx={{ fontSize: "large", fontWeight: "700" }}>
              Sign up
            </Typography>
          </Button>

          <div className="text-right text-white w-[100%] pr-2">
            <span>
              Already have an account?{" "}
              <Link to="/user-signin" className="font-bold text-[#FEC400]">
                Sign In
              </Link>
            </span>
            {/* use Link or navigate here for routing to sign in page */}
          </div>
        </form>        
      </Box>
    </>
  );
};

export default UserSignUp;
