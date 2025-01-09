import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Landing = () => {
    const theme = useTheme();

    const containerStyles = {
        display: 'flex',
        gap: '0.6rem',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '100%',
        height: { xs: '100%', sm: '100vh' },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        padding: '1rem',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
    };

    const buttonStyles = (color) => ({
        backgroundColor: theme.palette[color].main,
        fontWeight: 'bold',
        width: '10rem',
        '&:hover': { backgroundColor: theme.palette[color].dark },
    });

    return (
        <Box sx={containerStyles}>
            <Box sx={{ width: '50%', margin: '0.4rem' }}>
                <img
                    draggable="false"
                    src="/safarmitrac.svg"
                    alt="safarmitra-logo"
                    style={{ width: '100%', userSelect: 'none' }}
                />
            </Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Hello, welcome to SafarMitra
            </Typography>
            <Typography variant="h6" component="p" gutterBottom>
                Please let us know, are you a:
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    [theme.breakpoints.up('sm')]: {
                        flexDirection: 'row',
                    },
                }}
            >
                <Link to="/user-signup">
                    <Button variant="contained" sx={buttonStyles('primary')}>
                        User
                    </Button>
                </Link>
                <Link to="/captain-signup">
                    <Button variant="contained" sx={buttonStyles('secondary')}>
                        Driver
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default Landing;