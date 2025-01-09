import React from "react";
import { useRef, useState } from "react";
import { Box, Typography, Button, TextField, FormControl,Snackbar,Alert } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import theme from "../../styles/theme";

const CaptainSignIn = () => {
  const navigate = useNavigate();
  const yellowTheme = theme.palette.primaryColor.main;
  const emailRef = useRef();
  const passwordRef = useRef();
  // const [open, setOpen] = useState(false);
  // const vertical = "top", horizontal = "center";
  // let message = ''

  // error snackbar 
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: 'sign in failed',
  });
  const { vertical, horizontal, open , message } = state;
  // snackbar(alert) close function
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: emailRef.current.value,
      password: passwordRef.current.value
    }
    axios.post(`${import.meta.env.VITE_BASE_URL}/driver/login`,userData,{withCredentials:true})
    .then( (res) => {
      console.log(res);
      navigate("/captain-homepage")
    }

    ).catch( (e) => {
      // driver email not found -> 400 error 
      // correct email but wrong password -> 400 error 
      console.log(e);
      setState({ ...state, open: true, message: e.response.data });
      
    }

    ).finally(
      
    )
  }

  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: "3rem",
        paddingX: "1rem",
      }}
    >

      {/* sign in errors snackbar */}
      <Snackbar
        message= {message}
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

      <form className="mx-3.5 flex flex-col gap-y-3 justify-center items-center"
        onSubmit={handleSubmit}
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
                to="/captain-signup"
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
  );
};

export default CaptainSignIn;
