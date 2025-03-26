import React, { useState } from "react";
import { Box, Typography, Avatar, IconButton, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

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
      console.error("שגיאה במחיקת תגובה:", err);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const updatedComment = { text: editedText };
      await axios.patch(
        `/cards/${postId}/comments/${comment._id}`,
        updatedComment,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      console.error("שגיאה בעדכון התגובה:", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      mb={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 40, height: 40 }} src={comment.user_id?.image} />
        <Box>
          <Typography variant="body2" fontWeight="bold">
            {comment.user_id?.firstName} {comment.user_id?.lastName}
          </Typography>
          {isEditing ? (
            <TextField
              fullWidth
              variant="outlined"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              size="small"
            />
          ) : (
            <Typography variant="body2">{comment.text}</Typography>
          )}
        </Box>
      </Box>

      {isCommentOwnerOrAdmin && (
        <Box display="flex" gap={1}>
          {!isEditing ? (
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon color="primary" />
            </IconButton>
          ) : (
            <IconButton onClick={handleSaveEdit}>
              <SaveIcon color="success" />
            </IconButton>
          )}
          <IconButton onClick={handleDelete}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default Comment;
