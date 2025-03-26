import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter } from "react-router-dom";

// 🎨 חדש
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme/theme";
import { useMemo } from "react";

// 👇 עטיפה שתמשוך את מצב darkMode מתוך Redux
const ThemeWrapper = ({ children }) => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const currentTheme = useMemo(
    () => (isDarkMode ? darkTheme : lightTheme),
    [isDarkMode]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeWrapper>
          <App />
        </ThemeWrapper>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
