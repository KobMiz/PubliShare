import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";
import { Link } from "react-router-dom";

const Comment = ({ comment, postId, token, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isCommentOwnerOrAdmin =
    currentUser?._id === comment.user_id?._id || currentUser?.isAdmin;

  const handleDelete = async () => {
    try {
      await axios.delete(`/cards/${postId}/comments/${comment._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onUpdate();
    } catch (err) {
      console.error("❌ שגיאה במחיקת תגובה:", err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await axios.patch(
        `/cards/${postId}/comments/${comment._id}`,
        { text: editedText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("❌ שגיאה בעדכון תגובה:", err);
    }
  };

  const avatarSrc = comment.user_id?.image
    ? comment.user_id.image
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      mb={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Link
          to={`/users/user-profile/${comment.user_id?._id}`}
          style={{ textDecoration: "none" }}
        >
          <Avatar sx={{ width: 40, height: 40 }} src={avatarSrc} />
        </Link>
        <Box>
          <Link
            to={`/users/user-profile/${comment.user_id?._id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              {comment.user_id?.firstName} {comment.user_id?.lastName}
            </Typography>
          </Link>
          {isEditing ? (
            <TextField
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              size="small"
              variant="outlined"
              fullWidth
            />
          ) : (
            <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
              {comment.text}
            </Typography>
          )}
        </Box>
      </Box>

      {isCommentOwnerOrAdmin && (
        <Box display="flex" alignItems="center" gap={1}>
          {!isEditing ? (
            <IconButton onClick={() => setIsEditing(true)} size="small">
              <EditIcon color="primary" />
            </IconButton>
          ) : (
            <IconButton onClick={handleSaveEdit} size="small">
              <SaveIcon color="success" />
            </IconButton>
          )}
          <IconButton onClick={handleDelete} size="small">
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default Comment;
