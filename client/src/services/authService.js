import axios from "axios";

const API_URL = "/users";

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        "Content-Type": "application/json", // JSON
      },
    });
    console.log("📦 Response from /login:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw new Error("Login failed");
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw new Error("Registration failed");
  }
};

const authService = {
  login,
  register,
};

export default authService;
