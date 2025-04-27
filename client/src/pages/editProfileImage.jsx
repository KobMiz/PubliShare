import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "@mui/material/styles";
import { updateProfileImage } from "../store/userSlice";

const EditProfileImage = () => {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageDeleted, setImageDeleted] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.image) {
      setPreview(user.image);
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl("");
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUrlChange = (e) => {
    setImageUrl(e.target.value);
    setSelectedFile(null);
    setPreview(e.target.value);
  };

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.delete("/users/profile-image", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const defaultImage =
        data.image ||
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

      dispatch(updateProfileImage(defaultImage));
      setPreview(defaultImage);
      setImageUrl("");
      setSelectedFile(null);
      setImageDeleted(true);
      setSnackbarOpen(true);
    } catch (err) {
      console.error("❌ Error deleting image:", err);
      if (err.response) {
        if (err.response.status === 403) {
          setError("אין לך הרשאות לבצע את המחיקה.");
        } else if (err.response.status === 404) {
          setError("משתמש לא נמצא. אנא התחבר מחדש.");
        } else {
          setError(err.response.data?.error || "שגיאה במחיקת התמונה.");
        }
      } else {
        setError("שגיאת רשת: נסה שוב מאוחר יותר.");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!selectedFile && !imageUrl && !imageDeleted) {
      setError("אנא בחר קובץ או הזן כתובת URL תקינה.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (selectedFile) {
        const formData = new FormData();
        formData.append("profileImage", selectedFile);

        const { data } = await axios.post("/users/profile-image", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        dispatch(updateProfileImage(data.imagePath));
        setSnackbarOpen(true);
        setTimeout(() => navigate("/profile"), 1500);
      } else if (imageUrl) {
        if (!validateUrl(imageUrl)) {
          setError("כתובת URL אינה תקינה. נסה שוב.");
          setLoading(false);
          return;
        }

        await axios.patch(
          `/users/${user._id}`,
          { image: imageUrl },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        dispatch(updateProfileImage(imageUrl));
        setSnackbarOpen(true);
        setTimeout(() => navigate("/profile"), 1500);
      } else if (imageDeleted) {
        setSnackbarOpen(true);
        setTimeout(() => navigate("/profile"), 1500);
      }
    } catch (err) {
      console.error("❌ Error saving image:", err);
      if (err.response?.status === 403) {
        setError("אין לך הרשאה לבצע פעולה זו.");
      } else {
        setError("שגיאה בשמירת התמונה. נסה שנית.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
        עריכת תמונת פרופיל
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box textAlign="center" mb={2}>
        <Avatar
          src={preview}
          alt="תצוגה מקדימה"
          sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
        />

        <Button variant="outlined" component="label" sx={{ mb: 1 }}>
          בחר קובץ מהמחשב
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileChange}
          />
        </Button>

        <TextField
          label="או כתובת URL של תמונה"
          value={imageUrl}
          onChange={handleUrlChange}
          fullWidth
          margin="normal"
          InputLabelProps={{
            style: { color: isDarkMode ? "grey.400" : undefined },
          }}
          InputProps={{
            style: { color: isDarkMode ? "white" : undefined },
          }}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Tooltip title="חזרה לפרופיל" arrow>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate("/profile")}
            startIcon={<ArrowForwardIosIcon />}
            sx={{ minWidth: 130, gap: 2 }}
          >
            חזור
          </Button>
        </Tooltip>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={loading}
          sx={{ mx: 2, minWidth: 130 }}
        >
          {loading ? <CircularProgress size={24} /> : "שמור"}
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteImage}
          disabled={loading}
          sx={{ minWidth: 130 }}
        >
          מחק תמונה
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="התמונה עודכנה בהצלחה!"
      />
    </Box>
  );
};

export default EditProfileImage;
