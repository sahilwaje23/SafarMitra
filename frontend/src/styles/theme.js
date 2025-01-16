import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    mode: "dark",
    // added two custom colors to the palette -> yellow and red
      primaryColor: {
        main: "#FEC400",  
        hover: "#b79420",
        contrastText: "#000000", // Optional: text color for contrast
      },
      secondaryColor: {
        main: "#B7083C",
        contrastText: "#ffffff", // Optional: text color for contrast
        hover: "#7a0524",
      },
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

export default theme;
