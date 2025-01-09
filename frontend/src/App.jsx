import React from 'react';
import theme from './styles/theme';
import { Routes, Route } from 'react-router-dom';
import { CaptainHomePage, CaptainSignIn, CaptainSignUp, Landing, UserHomePage, UserSignIn, UserSignUp } from './components';
import { ThemeProvider, CssBaseline} from "@mui/material";


function App() {
  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* This makes sure the theme is applied globally */}
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/user-signup' element={<UserSignUp />} />
        <Route path='/user-signin' element={<UserSignIn />} />
        <Route path='/captain-signup' element={<CaptainSignUp />} />
        <Route path='/captain-signin' element={<CaptainSignIn />} />
        <Route path='/user-homepage' element={<UserHomePage />} />
        <Route path='/captain-homepage' element={<CaptainHomePage />} />
        
        {/* Add further routes here */}
      </Routes>
    </ThemeProvider>   
  );
}

export default App;