import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Typography, Avatar, Alert } from "@mui/material";
import { useSelector } from "react-redux";

const UploadProfileImage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { token } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await axios.post("/users/profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("התמונה הועלתה בהצלחה!");
      setError("");
    } catch (err) {
      console.error(err);
      setError("אירעה שגיאה בהעלאת התמונה.");
      setSuccess("");
    }
  };

  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="h6" gutterBottom>
        העלאת תמונת פרופיל
      </Typography>

      {preview && (
        <Avatar
          src={preview}
          alt="Preview"
          sx={{ width: 100, height: 100, margin: "0 auto", mb: 2 }}
        />
      )}

      <input type="file" accept="image/*" onChange={handleChange} />
      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file}
        sx={{ mt: 2 }}
      >
        העלה תמונה
      </Button>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default UploadProfileImage;
