import React from 'react';
import theme from './styles/theme';
import { Routes, Route } from 'react-router-dom';
import { CaptainHomePage, CaptainSignIn, CaptainSignUp, Landing, UserHomePage, UserSignIn, UserSignUp } from './components';

function App({ toggleTheme }) {
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    < div className={`bg-${theme.palette.background.dark} min-h-screen h-[100%] bg-black flex place-content-center `} >
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
    </div>    
  );
}

export default App;