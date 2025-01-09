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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import axios from "axios";

const CaptainSignUp = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const vechileRef = useRef();
  const chassisRef = useRef();
  const [gender, setGender] = useState("");
  const [aadhar, setAadhar] = useState();
  const [profile, setProfile] = useState();
  const [registration, setRegistration] = useState();
  const [license, setLicense] = useState();
  const navigate = useNavigate();
  // const [isSignedUp, setIsSignedUp] = useState(false);
  const yellowTheme = theme.palette.primaryColor.main;
  const balooBhai = theme.typography.h1.fontFamily2;

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // on successful sign up. open dialog
    const newDriver = {
      fullName: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      mobileNo: phoneRef.current.value,
      gender: gender,
      vehicleNo: vechileRef.current.value,
      chassisNo: chassisRef.current.value,
      profileImage: profile,
      aadharImage: aadhar,
      registrationCertificate: registration,
      licenseImage: license,
    };
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/driver/signup`,
        newDriver,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // for file upload (multer)
          },
        },
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          navigate("/captain-homepage");
          alert("signed up successfully");
          // setIsSignedUp(true);
        }
      })
      .catch((e) => {
        console.log(e);
        let message = "";
        if (e.response.data.errors && e.response.data.errors.length > 0) {
          // if errors array -> if email not in .vjti.ac.in domain or pass less than 8 characters
          message = e.response.data.errors.map((error) => error.msg).join("\n");
        } else {
          // duplicate error
          // alert("Email or Phone number already exists");
          message = "Email or Phone number already exists";
        }
        console.log(message)
        setState({ ...state, open: true, message });
      });
  };

  const handleFile = (e, setFile) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
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
          className="flex flex-col gap-2 w-full max-w-[700px] gap-y-[15px]"
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

          <Typography variant="h5">Personal Details: </Typography>
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
              required
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

          <Typography variant="h5">Vechile Details: </Typography>
          {/* Vechile Number */}
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="vechile"
              label="Vechile Number"
              variant="outlined"
              fullWidth
              inputRef={vechileRef}
              required
            />
          </FormControl>

          {/* Chassis Number */}
          <FormControl sx={{ width: "100%" }}>
            <TextField
              id="chassis"
              label="Chassis Number"
              variant="outlined"
              fullWidth
              inputRef={chassisRef}
              required
            />
          </FormControl>

          <Typography variant="h5">Upload Documents: </Typography>
          {/* Aadhar */}
          <div className="bg-transparent rounded-[1px] flex justify-between border-0">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-1 py-3 flex justify-left items-center pl-3 border-gray-600 ">
              Aadhar Image
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md cursor-pointer border-gray-600"
              accept=".png"
              type="file"
              id="aadhar"
              required
              onChange={(e) => handleFile(e, setAadhar)}
            />
          </div>

          {/* College ID */}
          {/* handle border color in light theme */}
          <div className="bg-transparent rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-1 py-3 flex justify-left items-center pl-3 border-gray-600">
              Profile Image
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md bg-transparent  cursor-pointer border-gray-600"
              accept=".png"
              type="file"
              id="profile"
              required
              onChange={(e) => handleFile(e, setProfile)}
            />
          </div>

          {/* Registration Certificate */}
          <div className="bg-transparent rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-1 py-3 flex justify-left items-center pl-3 border-gray-600">
              Registration Certificate
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md bg-transparent  cursor-pointer border-gray-600"
              accept=".png"
              type="file"
              id="registrationCertificate"
              required
              onChange={(e) => handleFile(e, setRegistration)}
            />
          </div>

          {/* License Image */}
          <div className="bg-transparent rounded-[1px] flex justify-between">
            <div className="w-[35%] text-[1rem] border-[1px] rounded-l-md border-r-0 h-[100%] px-1 py-3 flex justify-left items-center pl-3 border-gray-600">
              License Image
            </div>
            <input
              className="w-[65%] px-2 py-2 border-[1px] rounded-r-md bg-transparent  cursor-pointer border-gray-600"
              accept=".png"
              type="file"
              id="license"
              required
              onChange={(e) => handleFile(e, setLicense)}
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
                to="/captain-signin"
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

export default CaptainSignUp;
