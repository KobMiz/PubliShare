import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/common/PostCard";

const OtherUserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("חסר טוקן אימות. יש להתחבר למערכת.");
          setLoading(false);
          return;
        }

        const userResponse = await axios.get(`/users/user-profile/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userResponse.data);

        const postsResponse = await axios.get(`/cards?user_id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserPosts(postsResponse.data);
      } catch (err) {
        console.error("שגיאה בטעינת פרופיל:", err);
        setError("לא ניתן לטעון את פרטי המשתמש או הפוסטים.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 4, minHeight: "100vh" }}>
      <Card
        sx={{
          p: 3,
          boxShadow: 4,
          borderRadius: 4,
          maxWidth: 420,
          mx: "auto",
        }}
      >
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: "auto",
                mb: 2,
                fontSize: 36,
                background: user.image
                  ? "transparent"
                  : "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)",
                color: "white",
              }}
              src={user.image}
            >
              {user.firstName?.[0]}
            </Avatar>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {user.nickname}
            </Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Typography variant="subtitle2" color="text.secondary">
              🌍 מדינה:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {user.country}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="subtitle2" color="text.secondary">
              🎂 תאריך לידה:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {new Date(user.birthdate).toLocaleDateString("he-IL")}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box mt={5}>
        <Typography variant="h6" fontWeight="bold" mb={3} textAlign="center">
          פוסטים שפורסמו על ידי {user.firstName}:
        </Typography>

        {userPosts.length === 0 ? (
          <Alert severity="info">אין פוסטים להצגה.</Alert>
        ) : (
          userPosts.map((post) => (
            <PostCard
              key={post._id}
              {...post}
              currentUserId={
                localStorage.getItem("user")
                  ? JSON.parse(localStorage.getItem("user"))._id
                  : ""
              }
            />
          ))
        )}
      </Box>
    </Box>
  );
};

export default OtherUserProfile;
