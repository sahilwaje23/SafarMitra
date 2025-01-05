import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#FEC400',
        },
        secondary: {
            main: '#B7083C',
        },
        background: {
            light: '#ffffff',
            dark: '#121212', // Dark background
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
});

export default theme;