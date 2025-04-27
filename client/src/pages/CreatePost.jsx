import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [video, setVideo] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!text && !imageUrl && !video && !link) {
      setError("יש להזין לפחות תוכן אחד (טקסט, תמונה, קישור או וידאו).");
      return;
    }

    const postData = {
      text,
      image: {
        url: imageUrl || "",
        alt: imageAlt || "",
      },
      video: video || "",
      link: link || "",
    };

    try {
      await axios.post("/cards", postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("הפוסט פורסם בהצלחה!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("❌ שגיאה ביצירת הפוסט:", err);
      setError("אירעה שגיאה בעת פרסום הפוסט. נסה שוב.");
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          יצירת פוסט חדש
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="תוכן הפוסט (טקסט)"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <TextField
            label="קישור לתמונה (URL)"
            fullWidth
            margin="normal"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <TextField
            label="טקסט חלופי לתמונה (alt)"
            fullWidth
            margin="normal"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />

          <TextField
            label="קישור לווידאו (YouTube וכו')"
            fullWidth
            margin="normal"
            value={video}
            onChange={(e) => setVideo(e.target.value)}
          />

          <TextField
            label="קישור חיצוני (למאמר, אתר וכו')"
            fullWidth
            margin="normal"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {success}
            </Alert>
          )}

          <Box textAlign="center" mt={3}>
            <Button variant="contained" color="primary" type="submit">
              פרסם פוסט
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreatePost;
