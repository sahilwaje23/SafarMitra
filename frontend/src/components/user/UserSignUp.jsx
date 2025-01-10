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
    if (e.target.files[0]) {
      setAadhar(e.target.value);
    }
  };

  const handleIdFile = (e) => {
    if (e.target.files[0]) {
      setId(e.target.value);
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

      {/* Form Content */}
      <form
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
                "&:hover fieldset": { borderColor: theme.palette.background.light },
                "&.Mui-focused fieldset": { borderColor: theme.palette.background.light },
              },
              "& .MuiInputLabel-root": { color: theme.palette.background.light },
              "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.background.light },
            }}
            name="fullName"
            ref={nameRef}
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
                "&:hover fieldset": { borderColor: theme.palette.background.light },
                "&.Mui-focused fieldset": { borderColor: theme.palette.background.light },
              },
              "& .MuiInputLabel-root": { color: theme.palette.background.light },
              "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.background.light },
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
              input: { color: theme.palette.background.light },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: theme.palette.background.light },
                "&:hover fieldset": { borderColor: theme.palette.background.light },
                "&.Mui-focused fieldset": { borderColor: theme.palette.background.light },
              },
              "& .MuiInputLabel-root": { color: theme.palette.background.light },
              "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.background.light },
            }}
            ref={passwordRef}
            name="password"
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
            onChange={(e) => setGender(e.target.value)}
            name="gender"
          >
            <MenuItem value={"male"}>male</MenuItem>
            <MenuItem value={"female"}>female</MenuItem>
            <MenuItem value={"other"}>other</MenuItem>
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
              "&:hover fieldset": { borderColor: theme.palette.background.light },
              "&.Mui-focused fieldset": { borderColor: theme.palette.background.light },
            },
            "& .MuiInputLabel-root": { color: theme.palette.background.light },
            "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.background.light },
          }}
          name="mobileNo"
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
