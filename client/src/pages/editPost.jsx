import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const EditPost = () => {
  const { postId } = useParams(); 
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);

  const [post, setPost] = useState(null);
  const [text, setText] = useState(""); 
  const [image, setImage] = useState(""); 
  const [video, setVideo] = useState(""); 
  const [link, setLink] = useState(""); 

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.get(`/cards/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(data);
        setText(data.text);
        setImage(data.image?.url || "");
        setVideo(data.video || "");
        setLink(data.link || "");
      } catch (err) {
        console.error("❌ שגיאה בשליפת הפוסט:", err);
      }
    };

    fetchPost();
  }, [postId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPost = { text, image, video, link };

      await axios.patch(`/cards/${postId}`, updatedPost, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/post/${postId}`); 
    } catch (err) {
      console.error("❌ שגיאה בעדכון הפוסט:", err);
    }
  };

  if (!post) {
    return <Typography>טוען פוסט...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        ערוך את הפוסט
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="תוכן הפוסט"
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="תמונה (URL)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="וידאו (URL)"
          value={video}
          onChange={(e) => setVideo(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="קישור (URL)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Button variant="contained" type="submit">
            עדכן פוסט
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditPost;
