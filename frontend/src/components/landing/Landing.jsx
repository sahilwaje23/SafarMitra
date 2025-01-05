import React from 'react';
import theme from '../../styles/theme';
import { Box, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Landing = () => {
    const isDarkMode = theme.palette.mode === 'dark';

    return (
        <Box 
            sx={{ 
                display: 'flex',
                gap: '0.6rem', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%',
                maxWidth: '100%',
                height: { xs: '100%', sm: '100vh', md: 'h-screen', lg: 'h-screen' }, 
                backgroundColor: isDarkMode ? theme.palette.background.dark : theme.palette.background.light,
                padding: '1rem', 
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
            }}
            className={isDarkMode ? "bg-gray-900 bg-opacity-50" : "bg-gray-200 bg-opacity-50"}
        >
            <Box sx={{ width: '50%', margin: '0.4rem' }}>
                <img draggable='false' src="/safarmitrac.svg" alt="safarmitra-logo"
                className='drop-shadow-xl'
                style={{ width: '100%', userSelect: 'none'  }}
                />
            </Box>
            <Typography variant="h3" component="h1" className={isDarkMode ? "text-white" : "text-black"}>
                Hello, welcome to SafarMitra
            </Typography>
            <Typography variant="h5" component="p" gutterBottom className={isDarkMode ? "text-white" : "text-black"}>
                Please let us know, are you a:
            </Typography>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem', 
                [theme.breakpoints.up('sm')]: {
                    flexDirection: 'row',
                },
            }}>
                <Link to='/user-signup'>
                    <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ 
                            backgroundColor: theme.palette.primary.main,
                            fontWeight: 'bold', 
                            width: '10rem',
                            '&:hover': { backgroundColor: theme.palette.primary.dark } 
                        }}
                    >
                        User
                    </Button>
                </Link>
                <Link to='/captain-signup'>
                    <Button 
                        variant="contained" 
                        color="secondary"
                        sx={{ 
                            backgroundColor: theme.palette.secondary.main,
                            fontWeight: 'bold', 
                            width: '10rem',
                            '&:hover': { backgroundColor: theme.palette.secondary.dark } 
                        }}
                    >
                        Driver
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default Landing;