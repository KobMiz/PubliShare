import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/authService";

const storedUser = JSON.parse(localStorage.getItem("user"));
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser || null,
  token: storedToken || null,
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const login = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      return await authService.login(credentials); 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Login failed"
      );
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      return response; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload.user,
          image: action.payload.user.image || null, 
        };
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
