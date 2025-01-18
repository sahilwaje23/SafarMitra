import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primaryColor: {
      main: "#FEC400",
      hover: "#b79420",
      contrastText: "#000000",
    },
    secondaryColor: {
      main: "#B7083C",
      contrastText: "#ffffff",
      hover: "#7a0524",
    },
    txtcol: "#ffffff", // Default text color for dark mode
    tbgcolor: "rgba(0, 0, 0, 0.6)", // Transparent background color for messages
  },

  typography: {
    fontFamily: "Poppins, Roboto, Arial, sans-serif",
    h1: {
      fontFamily: '"Baloo Bhai 2", Poppins, Roboto, Arial, sans-serif',
      fontWeight: 800,
    },
    h2: {
      fontFamily: '"Baloo Bhai 2", Poppins, Roboto, Arial, sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Baloo Bhai 2", Poppins, Roboto, Arial, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: '"Baloo Bhai 2", Poppins, Roboto, Arial, sans-serif',
      fontWeight: 500,
    },
    h5: {
      fontFamily: '"Baloo Bhai 2", Poppins, Roboto, Arial, sans-serif',
      fontWeight: 400,
    },
    h6: {
      fontFamily: '"Baloo Bhai 2", Poppins, Roboto, Arial, sans-serif',
      fontWeight: 300,
    },
  },
});

// Dynamically update txtcol and tbgcolor based on mode
theme.palette.txtcol = theme.palette.mode === "dark" ? "#ffffff" : "#000000";
// below is specifically for chats but can be extended
theme.palette.tbgcolor =
  theme.palette.mode === "dark"
    ? "rgba(1, 1, 1, 0.8)"
    : "rgba(223, 223, 223, 0.4)";

export default theme;
