import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

export const darkTheme = createTheme({
  direction: "rtl",
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
    },
  },
});
