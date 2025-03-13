import React, { useState } from "react";
import { ThemeProvider, createTheme, CssBaseline, Button } from "@mui/material";

function App() {
  // State to toggle between light and dark theme
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Define light theme
  const lightTheme = createTheme({
    palette: {
      mode: "light",
    },
  });

  // Define dark theme
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline /> {/* This makes sure the theme is applied globally */}
      <div style={{ padding: 20 }}>
        <Button variant="contained" onClick={() => setIsDarkMode(!isDarkMode)}>
          Toggle Theme
        </Button>
        <h1>{isDarkMode ? "Dark Mode" : "Light Mode"}</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;