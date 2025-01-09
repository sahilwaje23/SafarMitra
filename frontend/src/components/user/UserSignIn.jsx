import React from "react";
import { useRef, useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../../styles/theme";

const UserSignIn = () => {
  const yellowTheme = theme.palette.primaryColor.main;
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // error sanckbar
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
    message: "Sign In failed",
  });
  const { vertical, horizontal, open, message } = state;
  // snackbar(alert) close function
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  // handle form
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(
        "http://localhost:8000/login",
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setTimeout(() => {
          setIsLoading(false);
        },500)
        console.log(res);
        if (res.status === 200) {
          alert("sign in successful");
          navigate("/user-homepage");
        }
      })
      .catch((e) => {
        setTimeout(() => {
          setIsLoading(false);
        },500)
        // console.log(e.data.err);
        // alert(e.data.err)
        setState({
          ...state,
          open: true,
          message: "email or password is incorrect",
        });
      });
  };

  return (
    <>
      <LinearProgress
        sx={{
          width: "100%",
          height: "2px",
          visibility: isLoading ? "" : "hidden",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          rowGap: "3rem",
          paddingX: "1rem",
        }}
      >
        <Snackbar
          message={message}
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={5000}
        />

        {/* back button */}
        <Button
          variant="text"
          size="large"
          sx={{ alignSelf: "start", paddingLeft: "0px", color: yellowTheme }}
          onClick={() => navigate(-1)}
        >
          <Typography variant="h6">&lt; Back</Typography>
        </Button>

        <form
          onSubmit={handleSubmit}
          className="mx-3.5 flex flex-col gap-y-3 justify-center items-center"
        >
          <div className="flex flex-col gap-y-3 max-w-[500px] min-w-[300px] w-full">
            {/* signup text heading */}
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Sign In
            </Typography>

            {/* form input and button */}
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

            {/* Sign In Button */}
            <Button
              sx={{ height: "3.3rem", backgroundColor: yellowTheme }}
              variant="contained"
              type="submit"
              fullWidth
            >
              <Typography sx={{ fontSize: "large", fontWeight: "bold" }}>
                Sign In
              </Typography>
            </Button>
            <div className="text-right w-[100%] pr-2">
              <span>
                Don't have an account?
                <Link
                  to="/user-signup"
                  className={`font-bold text-[${yellowTheme}]`}
                >
                  Sign Up
                </Link>
              </span>
              {/* use Link or navigate here for routing to sign in page */}
            </div>
          </div>
        </form>
      </Box>
    </>
  );
};

export default UserSignIn;
