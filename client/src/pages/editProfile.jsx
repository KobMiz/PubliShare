import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { updateUser } from "../store/userSlice";

const EditProfile = () => {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nickname: "",
    country: "",
    birthdate: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickname: user.nickname || "",
        country: user.country || "",
        birthdate: user.birthdate ? user.birthdate.slice(0, 10) : "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        nickname: formData.nickname,
        country: formData.country,
        birthdate: formData.birthdate,
      };

      const response = await axios.patch(`/users/${user._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch(updateUser(response.data));
      setSuccess("הפרטים עודכנו בהצלחה!");
      setSnackbarOpen(true);
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("אירעה שגיאה בעדכון הפרטים.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEditImage = () => {
    navigate("/edit-profile-image");
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 4,
        backgroundColor: isDarkMode ? "grey.900" : "background.paper",
        color: isDarkMode ? "grey.100" : "text.primary",
      }}
    >
      <Typography
        variant="h5"
        textAlign="center"
        mb={3}
        color={isDarkMode ? "grey.100" : "text.primary"}
      >
        עריכת פרטי משתמש
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TextField
        name="firstName"
        label="שם פרטי"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          style: { color: isDarkMode ? "grey.400" : undefined },
        }}
        InputProps={{
          style: { color: isDarkMode ? "white" : undefined },
        }}
      />
      <TextField
        name="lastName"
        label="שם משפחה"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          style: { color: isDarkMode ? "grey.400" : undefined },
        }}
        InputProps={{
          style: { color: isDarkMode ? "white" : undefined },
        }}
      />
      <TextField
        name="nickname"
        label="כינוי"
        value={formData.nickname}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          style: { color: isDarkMode ? "grey.400" : undefined },
        }}
        InputProps={{
          style: { color: isDarkMode ? "white" : undefined },
        }}
      />
      <TextField
        name="country"
        label="מדינה"
        value={formData.country}
        onChange={handleChange}
        fullWidth
        margin="normal"
        InputLabelProps={{
          style: { color: isDarkMode ? "grey.400" : undefined },
        }}
        InputProps={{
          style: { color: isDarkMode ? "white" : undefined },
        }}
      />
      <TextField
        name="birthdate"
        label="תאריך לידה"
        type="date"
        value={formData.birthdate}
        onChange={handleChange}
        InputLabelProps={{ shrink: true }}
        fullWidth
        margin="normal"
        onClick={(e) => e.target.showPicker && e.target.showPicker()} // 💥 פותח את לוח השנה גם בלחיצה על כל השדה
        sx={{
          "& .MuiInputBase-root": {
            color: isDarkMode ? "grey.100" : "inherit",
          },
          "& .MuiInputBase-input": {
            color: isDarkMode ? "grey.100" : "inherit",
            cursor: "pointer", // שיהיה גם חץ נחמד
          },
          "& .MuiSvgIcon-root": {
            color: isDarkMode ? "grey.100" : "inherit",
          },
        }}
      />

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "שמור"}
        </Button>

        <Button variant="contained" color="primary" onClick={handleEditImage}>
          עריכת תמונת פרופיל
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="הפרטים עודכנו בהצלחה."
      />
    </Box>
  );
};

export default EditProfile;
