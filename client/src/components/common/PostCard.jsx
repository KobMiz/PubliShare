import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  TextField,
  Button,
  Avatar,
  Link as MuiLink,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LaunchIcon from "@mui/icons-material/Launch";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Comment from "./comment";

const PostCard = ({
  _id,
  text,
  image,
  video,
  link,
  likes = [],
  createdAt,
  currentUserId,
  user_id,
  onFavoriteToggle,
}) => {
  const { token } = useSelector((state) => state.user);
  const [isLiked, setIsLiked] = useState(
    currentUserId ? likes.includes(currentUserId) : false
  );
  const [likeCount, setLikeCount] = useState(likes.length);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isOwnerOrAdmin =
    currentUserId === user_id?._id ||
    JSON.parse(localStorage.getItem("user"))?.isAdmin;

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const { data } = await axios.get(`/cards/${_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(data.comments || []);
      } catch (err) {
        console.error("❌ שגיאה בעת שליפת תגובות:", err);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [_id, token]);

  const handleLikeClick = async () => {
    try {
      const { data } = await axios.patch(
        `/cards/${_id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLiked(data.isLikedByCurrentUser);
      setLikeCount(data.likesCount);

      if (onFavoriteToggle) {
        onFavoriteToggle();
      }
    } catch (err) {
      console.error("שגיאה בלחיצה על לייק:", err);
    }
  };

  const handleCommentSend = async () => {
    if (commentText.trim() === "") return;
    try {
      await axios.post(
        `/cards/${_id}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const { data } = await axios.get(`/cards/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(data.comments || []);
      setCommentText("");
    } catch (err) {
      console.error("❌ שגיאה בעת שליחת תגובה:", err);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`/cards/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload();
    } catch (err) {
      console.error("❌ שגיאה במחיקת הפוסט:", err);
    }
  };

  const handleNavigate = (e) => {
    const tagName = e.target.tagName.toLowerCase();
    if (tagName !== "a" && tagName !== "svg" && tagName !== "path") {
      navigate(`/post/${_id}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleCommentSend();
    }
  };

  return (
    <Card
      sx={{
        mb: 4,
        maxWidth: 750,
        mx: "auto",
        p: 2,
        borderRadius: 3,
        boxShadow: 2,
        transition: "box-shadow 0.3s ease",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          px: 2,
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <MuiLink
            component={Link}
            to={`/users/user-profile/${user_id?._id}`}
            underline="none"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Avatar
              src={user_id?.image}
              alt={`${user_id?.firstName} ${user_id?.lastName}`}
              sx={{ width: 32, height: 32 }}
            />
          </MuiLink>

          <MuiLink
            component={Link}
            to={`/users/user-profile/${user_id?._id}`}
            underline="hover"
            fontWeight="bold"
            color="inherit"
          >
            {user_id?.firstName} {user_id?.lastName}
          </MuiLink>
        </Box>

        {isOwnerOrAdmin && (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  navigate(`/edit/${_id}`);
                }}
              >
                ✏️ ערוך פוסט
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  handleDeletePost();
                }}
              >
                🗑️ מחק פוסט
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      {/* ⬇️ עוטפים את כל האזור הזה בלחיצה */}
      <CardContent
        sx={{ textAlign: "center", cursor: "pointer" }}
        onClick={handleNavigate}
      >
        {text && (
          <Typography variant="body1" sx={{ mb: 2, fontSize: 20 }}>
            {text}
          </Typography>
        )}
        {image?.url && (
          <CardMedia
            component="img"
            image={image.url}
            alt={image.alt || "תמונה"}
            sx={{ height: 250, objectFit: "cover", borderRadius: 2, mb: 2 }}
          />
        )}
        {video && (
          <Box sx={{ my: 1 }}>
            <MuiLink
              href={video}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              <PlayCircleFilledIcon />
              <Typography variant="body2">לצפייה בYouTube</Typography>
            </MuiLink>
          </Box>
        )}
        {link && (
          <Box sx={{ mt: 1 }}>
            <MuiLink
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                textDecoration: "none",
                color: "secondary.main",
              }}
            >
              <LaunchIcon />
              <Typography variant="body2">לצפייה בקישור המצורף</Typography>
            </MuiLink>
          </Box>
        )}
      </CardContent>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          px: 2,
          alignItems: "center",
        }}
      >
        <IconButton onClick={handleLikeClick} color="primary">
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="caption">{likeCount} לייקים</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box px={2}>
        {loadingComments ? (
          <CircularProgress size={24} />
        ) : (
          comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              postId={_id}
              token={token}
              onUpdate={() => {
                (async () => {
                  try {
                    const { data } = await axios.get(`/cards/${_id}`, {
                      headers: { Authorization: `Bearer ${token}` },
                    });
                    setComments(data.comments || []);
                  } catch (err) {
                    console.error("❌ שגיאה בעת עדכון תגובות:", err);
                  }
                })();
              }}
            />
          ))
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: 2,
          px: 2,
        }}
      >
        <TextField
          size="small"
          fullWidth
          placeholder="הוסף תגובה..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyPress}
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
    </Card>
  );
};

export default PostCard;
