import React from 'react';
import theme from './styles/theme';
import Landing from './components/landing/Landing';
// import Navbar from './components/navbar/Navbar';

function App({ toggleTheme }) {
  const isDarkMode = theme.palette.background === 'dark';

  return (
    <>
      {/* <Navbar toggleTheme={toggleTheme} /> component in development*/}
      <div className={`flex justify-center items-center h-screen w-full max-width-100vw bg-opacity-50 ${isDarkMode ? "bg-gray-900 " : 'bg-gray-200'}`}>
        <Landing />
        {/* hello hello */}
      </div>
    </>
  );
}

export default App;