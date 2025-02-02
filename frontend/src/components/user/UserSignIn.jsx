import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import theme from "../../styles/theme";
import { EntityContext } from "../../contexts/EntityContext";

const UserSignIn = () => {
  const { setEntity } = useContext(EntityContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { msgForUser } = location.state || {};
  const yellowTheme = theme.palette.primaryColor.main;

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    vertical: "top",
    horizontal: "center",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!navigator.onLine) {
      setIsLoading(false);
      setSnackbar({
        open: true,
        message: "You are offline. Please check your internet connection.",
        vertical: "top",
        horizontal: "center",
      });
      return;
    }
    try {
      const response = await axios.post( `${import.meta.env.VITE_BASE_URL}/login`,
        {
          email: emailRef.current.value,
          password: passwordRef.current.value,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setEntity({ type: "USER", data: response.data.user });
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("USER", JSON.stringify(response.data.user));
        navigate("/user-homepage");
      }
    } catch (error) {
      console.log("Error Response:", error.response); // Inspect the error response)
      console.log("Email ref" ,  emailRef.current.value); // Inspect the error response)
      console.log("Password ref" , passwordRef.current.value ); // Inspect the error response)
      const message =
        error.response?.data?.errors?.map((err) => err.msg).join("\n") ||
        error.response?.data?.err ||
        "An unexpected error occurred";
      setSnackbar({
        open: true,
        message,
        vertical: "top",
        horizontal: "center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (msgForUser) {
      setSnackbar({
        open: true,
        message: msgForUser,
        vertical: "top",
        horizontal: "center",
      });
    }
  }, [msgForUser]);

  return (
    <>
      {isLoading && <LinearProgress sx={{ width: "100%", height: "2px" }} />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          px: 2,
        }}
      >
        <Snackbar
          open={snackbar.open}
          message={snackbar.message}
          anchorOrigin={{
            vertical: snackbar.vertical,
            horizontal: snackbar.horizontal,
          }}
          onClose={handleCloseSnackbar}
          autoHideDuration={5000}
        />
        <Button
          variant="text"
          size="large"
          sx={{ alignSelf: "start", color: yellowTheme }}
          onClick={() => navigate(-1)}
        >
          <Typography variant="h6">&lt; Back</Typography>
        </Button>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <Box
            sx={{
              maxWidth: 500,
              width: "100%",
              gap: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              Sign In
            </Typography>
            <FormControl fullWidth>
              <TextField
                label="Email"
                variant="outlined"
                inputRef={emailRef}
                required
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                inputRef={passwordRef}
                required
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ height: 54, backgroundColor: yellowTheme }}
            >
              <Typography fontWeight="bold" fontSize="large">
                {isLoading ? "Signing In..." : "Sign In"}
              </Typography>
            </Button>
            <Typography align="right">
              Don't have an account?{" "}
              <Link
                to="/user-signup"
                style={{ color: yellowTheme, fontWeight: "bold" }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default UserSignIn;
