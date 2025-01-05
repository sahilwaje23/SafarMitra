import React from 'react';
import theme from './styles/theme';
import { Routes, Route } from 'react-router-dom';
import { CaptainSignIn, CaptainSignUp, Landing, UserSignIn, UserSignUp } from './components';

function App({ toggleTheme }) {
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <div className={`flex justify-center items-center h-screen w-full max-width-100vw bg-opacity-50 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-200'}`}>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/user-signup' element={<UserSignUp />} />
        <Route path='/user-signin' element={<UserSignIn />} />
        <Route path='/captain-signup' element={<CaptainSignUp />} />
        <Route path='/captain-signin' element={<CaptainSignIn />} />
        {/* Add further routes here */}
      </Routes>
    </div>
  );
}

export default App;