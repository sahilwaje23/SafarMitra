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
  LinearProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import theme from "../../styles/theme";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
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
  const yellowTheme = theme.palette.primaryColor.main;
  const balooBhai = theme.typography.h1.fontFamily2;
  const [isLoading,setIsLoading] = useState(false);

  // error sanckbar
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "Sign Up failed",
  });
  const { vertical, horizontal, open, message } = state;
  // snackbar(alert) close function
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // handle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
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
        setIsLoading(false)
        if (res.status === 201) {
          navigate("/user-homepage");
          console.log(res);
          // alert("signed up successfully");
          // setIsSignedUp(true);
        }
      })
      .catch((e) => {
        setIsLoading(false)
        console.log(e);
        let message = "";
        if (e.response.data.errors && e.response.data.errors.length > 0) {
          // if errors array -> if email not in .vjti.ac.in domain or pass less than 8 characters
          // message = e.response.data.errors.map((error) => error.msg).join
          // ("\n\n");
          message = e.response.data.errors.map((error) => error.msg).join("\n");
        } else {
          // duplicate error
          message = "Email or Phone number already exists";
        }
        console.log(message);
        setState({ ...state, open: true, message });
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
    {/* progress */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "1rem",
          paddingX: "1rem",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LinearProgress
          sx={{
            width: "100%",
            height: "2px",
            display: isLoading ? "block" : "none",
          }}
        />
        {/* sign in successful snackbar(alert) */}
        <Snackbar
          message={message}
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={5000}
        />

        {/* Back Button - useNavigate here for go back */}
        <Button
          variant="text"
          size="large"
          sx={{
            alignSelf: "start",
            paddingLeft: "0px",
            color: yellowTheme,
            position: { md: "fixed" },
            top: "0",
          }}
          onClick={() => navigate(-1)}
        >
          <Typography variant="h6">&lt; Back</Typography>
        </Button>

        {/* Form Content */}
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 w-full max-w-[500px] gap-y-[15px]"
        >
          <div></div>
          {/* signup text heading */}
          <Typography
            variant="h4"
            sx={{
              fontFamily: balooBhai,
              fontWeight: theme.typography.h3.fontWeight,
            }}
          >
            Sign up
          </Typography>

          {/* Full Name TextField */}
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="outlined-full-name"
              label="Full Name"
              variant="outlined"
              fullWidth
              name="fullName"
              inputRef={nameRef}
              required
            />
          </FormControl>

          {/* Email TextField */}
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="outlined-email"
              label="Email"
              variant="outlined"
              fullWidth
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
              inputRef={passwordRef}
              name="password"
              required
            />
          </FormControl>

          {/* Gender Select */}
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="gender"
              id="gender"
              label="Gender"
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
            inputRef={phoneRef}
            name="mobileNo"
            required
          />

          {/* Aadhar */}
          <div className="bg-transparent rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-1 py-3 flex justify-left items-center pl-3 border-gray-600">
              Upload Aadhar
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md cursor-pointer border-gray-600"
              accept=".png"
              type="file"
              id="file-input"
              required
              onChange={handleAadharFile}
            />
          </div>

          {/* College ID */}
          <div className="bg-transparent rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-1 py-3 flex justify-left items-center pl-3 border-gray-600">
              Upload Id
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md bg-transparent cursor-pointer border-gray-600"
              accept=".png"
              type="file"
              id="id-input"
              required
              onChange={handleIdFile}
            />
          </div>

          {/* Sign Up Button */}
          <Button
            sx={{ height: "3.3rem", backgroundColor: yellowTheme }}
            variant="contained"
            type="submit"
          >
            <Typography sx={{ fontSize: "large", fontWeight: "700" }}>
              Sign up
            </Typography>
          </Button>

          <div className="text-right w-[100%] pr-2">
            <span>
              Already have an account?{" "}
              <Link
                to="/user-signin"
                className={`font-bold text-[${yellowTheme}]`}
              >
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
