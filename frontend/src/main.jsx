import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import createAppTheme from './styles/theme.js';

const Main = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Directly pass the mode (dark or light) to createAppTheme
  const theme = createAppTheme(darkMode ? 'dark' : 'light');

  return (
    <StrictMode>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App toggleTheme={toggleTheme} />
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Main />);
