import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
const Landing = () => {
    const theme = useTheme();
    return (
        <Box 
            sx={{ 
                display: 'flex',
                gap:'0.6rem', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%',
                maxWidth: '100%',
                height: { xs: '100%', sm: '100vh',md:'h-screen',lg:'h-screen' }, 
                backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                padding: '1rem', 
                backdropFilter: 'blur(10px)',
                textAlign: 'center'
            }}
            className="bg-gray-900 bg-opacity-50"
        >
            <Box sx={{ width: '50%', margin: '0.4rem' }}>
                <img src="/safarmitra.svg" alt="safarmitra-logo" style={{ width: '100%' }} />
            </Box>
            <Typography variant="h3" component="h1" className="text-white">
                Hello, welcome to SafarMitra
            </Typography>
            <Typography variant="h5" component="p" gutterBottom className="text-white">
                Please let us know, are you a:
            </Typography>
            <Box sx={{ 
                display: 'flex', 
                flexDirection:'column',
                gap: '1rem', 
               }}>
                <Link to='/user-signup'>
                    <Button 
                        variant="contained" 
                        color="primary"
                        sx={{ 
                            backgroundColor: 'primary.main',
                            fontWeight: 'bold', 
                            width:"10rem",
                            '&:hover': { backgroundColor: 'primary.dark' } 
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
                            backgroundColor: 'secondary.main', 
                            fontWeight: 'bold',
                            width:"10rem",
                            '&:hover': { backgroundColor: 'secondary.dark' } 
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