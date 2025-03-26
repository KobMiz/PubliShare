import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Divider,
  Link as MuiLink,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import { useSelector } from "react-redux";
import LaunchIcon from "@mui/icons-material/Launch";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SendIcon from "@mui/icons-material/Send";
import Comment from "../components/common/comment";

const PostDetails = () => {
  const { postId } = useParams();
  const { token } = useSelector((state) => state.user);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const fetchPost = async () => {
    try {
      const { data } = await axios.get(`/cards/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPost(data);
      setLikeCount(data.likes.length);
      setIsLiked(data.likes.includes(token));
    } catch (err) {
      console.error("שגיאה בטעינת פוסט:", err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId, token]);

  const handleLikeClick = async () => {
    try {
      const { data } = await axios.patch(
        `/cards/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLiked(data.isLikedByCurrentUser);
      setLikeCount(data.likesCount);
    } catch (err) {
      console.error("שגיאה בלחיצה על לייק:", err);
    }
  };

  const handleCommentSend = async () => {
    if (commentText.trim() === "") return;
    try {
      await axios.post(
        `/cards/${postId}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentText("");
      fetchPost();
    } catch (err) {
      console.error("❌ שגיאה בעת שליחת תגובה:", err);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
        <Typography mt={2}>טוען פוסט...</Typography>
      </Box>
    );
  }

  if (notFound || !post) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6">😕 הפוסט לא נמצא</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" mt={5} p={2}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar src={post.user_id?.image} sx={{ width: 50, height: 50 }} />
        <Box>
          <Typography variant="h6">
            {post.user_id?.firstName} {post.user_id?.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.user_id?.nickname}
          </Typography>
        </Box>
      </Box>

      {post.text && (
        <Typography variant="body1" sx={{ mb: 2 }}>
          {post.text}
        </Typography>
      )}

      {post.image?.url && (
        <Box
          component="img"
          src={post.image.url}
          alt="תמונה"
          sx={{
            width: "100%",
            height: 350,
            objectFit: "cover",
            borderRadius: 2,
            mb: 2,
          }}
        />
      )}

      {post.video && (
        <MuiLink
          href={post.video}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            color: "primary.main",
          }}
        >
          <PlayCircleFilledIcon /> צפה בסרטון
        </MuiLink>
      )}

      {post.link && (
        <MuiLink
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
            color: "secondary.main",
          }}
        >
          <LaunchIcon /> מעבר לקישור
        </MuiLink>
      )}

      <IconButton onClick={handleLikeClick}>
        {isLiked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </IconButton>
      <Typography variant="body2">{likeCount} לייקים</Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">תגובות</Typography>
      {post.comments.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          postId={postId}
          token={token}
          onUpdate={fetchPost}
        />
      ))}

      <Box display="flex" gap={1} mt={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="הוסף תגובה..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCommentSend}
          disabled={!commentText.trim()}
        >
          <SendIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default PostDetails;
