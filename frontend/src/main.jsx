import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ThemeProvider } from "@mui/material/styles";
import App from "./App.jsx";
import "./index.css";
// import theme from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import EntityContextProvider from "./contexts/EntityContext.jsx";
import SocketContextProvider from "./contexts/Socket.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider theme={theme}> */}
    <EntityContextProvider>
      <SocketContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketContextProvider>
    </EntityContextProvider>
    {/* </ThemeProvider> */}
  </StrictMode>
);
