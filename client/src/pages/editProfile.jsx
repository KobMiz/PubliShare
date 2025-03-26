import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { user, token } = useSelector((state) => state.user);
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
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        nickname: user.nickname || "",
        country: user.country || "",
        birthdate: user.birthdate?.slice(0, 10) || "",
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
  try {
    setLoading(true);
    setError("");
    setSuccess("");

    // שלח רק שדות שהשתנו ושאינם ריקים
    const updatedFields = {};
    for (let key in formData) {
      if (formData[key] !== user[key] && formData[key] !== "") {
        updatedFields[key] = formData[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      setError("לא בוצע שינוי בפרטים או שחלקם ריקים.");
      setLoading(false);
      return;
    }

    console.log("🟢 שדות שנשלחים:", updatedFields);

    await axios.patch(`/users/${user._id}`, updatedFields, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSuccess("הפרטים עודכנו בהצלחה!");
    setTimeout(() => navigate("/profile"), 1500);
  } catch (err) {
    console.error(err);
    setError("אירעה שגיאה בעדכון הפרטים.");
  } finally {
    setLoading(false);
  }
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
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" textAlign="center" mb={3}>
        עריכת פרטי משתמש
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        name="firstName"
        label="שם פרטי"
        value={formData.firstName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="lastName"
        label="שם משפחה"
        value={formData.lastName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="nickname"
        label="כינוי"
        value={formData.nickname}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="country"
        label="מדינה"
        value={formData.country}
        onChange={handleChange}
        fullWidth
        margin="normal"
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
      />

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "שמור"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditProfile;
