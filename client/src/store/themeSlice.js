import { createSlice } from "@reduxjs/toolkit";

const storedTheme = localStorage.getItem("isDarkMode");

const initialState = {
  isDarkMode: storedTheme ? JSON.parse(storedTheme) : false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode)); 
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      localStorage.setItem("isDarkMode", JSON.stringify(state.isDarkMode)); 
    },
  },
});

export const { toggleMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
