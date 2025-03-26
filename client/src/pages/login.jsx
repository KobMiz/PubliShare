import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage, user } = useSelector(
    (state) => state.user
  );

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(login(formData));
    if (login.fulfilled.match(resultAction)) {
      navigate("/"); 
    }
  };

  return (
    <Container maxWidth="sm" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        התחברות
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="אימייל"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="סיסמה"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        {isError && <Alert severity="error">{errorMessage}</Alert>}
        <Box mt={2}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "התחבר"}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Login;
