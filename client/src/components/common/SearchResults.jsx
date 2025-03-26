import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Box,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ results, onClose, insideDrawer = false }) => {
  const { users = [], posts = [], comments = [] } = results || {};
  const hasResults = users.length || posts.length || comments.length;
  const navigate = useNavigate();
  const theme = useTheme();

  const commonStyles = {
    borderRadius: 2,
    padding: 2,
    direction: "rtl",
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 20px rgba(255,255,255,0.05)"
        : "0 4px 12px rgba(0,0,0,0.15)",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.25 }}
      >
        <Box
          sx={{
            ...(insideDrawer
              ? {
                  maxHeight: 300,
                  overflowY: "auto",
                  mt: 1,
                }
              : {
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  width: "100%",
                  maxWidth: 400,
                  maxHeight: 400,
                  overflowY: "auto",
                  zIndex: 20,
                  mt: 1,
                }),
            ...commonStyles,
          }}
        >
          {!hasResults ? (
            <Typography variant="body2" align="center" sx={{ py: 2 }}>
              לא נמצאו תוצאות
            </Typography>
          ) : (
            <>
              {users.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      px: 1,
                      py: 0.5,
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      borderBottom: `1px solid ${
                        theme.palette.mode === "dark" ? "#444" : "#ddd"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    👤 משתמשים
                  </Typography>
                  <List dense>
                    {users.map((user) => (
                      <ListItem
                        key={user._id}
                        onClick={() => {
                          onClose?.();
                          navigate(`/users/user-profile/${user._id}`);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <ListItemAvatar>
                          <Avatar src={user.image} alt={user.nickname} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${user.firstName} ${user.lastName}`}
                          secondary={user.nickname}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                </Box>
              )}

              {posts.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      px: 1,
                      py: 0.5,
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      borderBottom: `1px solid ${
                        theme.palette.mode === "dark" ? "#444" : "#ddd"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    📝 פוסטים
                  </Typography>
                  <List dense>
                    {posts.map((post) => (
                      <ListItem
                        key={post._id}
                        onClick={() => {
                          onClose?.();
                          navigate(`/post/${post._id}`);
                        }}
                        sx={{ cursor: "pointer" }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={post.user_id?.image}
                            alt={post.user_id?.nickname}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={post.text?.slice(0, 50) + "..."}
                          secondary={`פורסם על ידי ${post.user_id?.nickname}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 1 }} />
                </Box>
              )}

              {comments.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      px: 1,
                      py: 0.5,
                      fontWeight: "bold",
                      color: theme.palette.primary.main,
                      borderBottom: `1px solid ${
                        theme.palette.mode === "dark" ? "#444" : "#ddd"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    💬 תגובות
                  </Typography>
                  <List dense>
                    {comments.map((comment) => (
                      <ListItem
                        key={comment._id}
                        onClick={() => {
                          onClose?.();
                          navigate(
                            `/post/${comment.cardId}#comment-${comment._id}`
                          );
                        }}
                        sx={{ cursor: "pointer", alignItems: "flex-start" }}
                      >
                        <ListItemAvatar>
                          <Avatar src={comment.user?.image} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={comment.text?.slice(0, 60) + "..."}
                          secondary={`תגובה מ-${comment.user?.nickname}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </>
          )}
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchResults;
