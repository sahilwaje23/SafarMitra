import { createTheme } from '@mui/material/styles';

const createAppTheme = (mode) => createTheme({
  palette: {
    mode: mode, // Dynamically set mode (dark or light)
    primary: {
      main: '#FEC400',
    },
    secondary: {
      main: '#B7083C',
    },
    background: {
      default: mode === 'dark' ? '#121212' : '#FFFFFF', // Dark or light background
    },
    text: {
      primary: mode === 'dark' ? '#FFFFFF' : '#000000', // Text color based on mode
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, Arial, sans-serif',
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
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: mode === 'dark' ? '#121212' : '#FFFFFF', // Dynamically set body background
          color: mode === 'dark' ? '#FFFFFF' : '#000000', // Dynamically set body text color
        },
      },
    },
  },
});

export default createAppTheme;
