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
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import PostCard from "../components/common/PostCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "45%",
      left: 5,
      zIndex: 2,
      bgcolor: "white",
      boxShadow: 2,
      ":hover": { bgcolor: "grey.200" },
    }}
  >
    <ArrowBackIos />
  </IconButton>
);

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "45%",
      right: 5,
      zIndex: 2,
      bgcolor: "white",
      boxShadow: 2,
      ":hover": { bgcolor: "grey.200" },
    }}
  >
    <ArrowForwardIos />
  </IconButton>
);

const Profile = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.user); 
  const id = params.id || user?._id; 
  const [profileUser, setProfileUser] = useState(null); 
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const isMobileView = useMediaQuery("(max-width:899px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          setError("לא הוזן מזהה משתמש.");
          setLoading(false);
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          setError("חסר טוקן אימות. יש להתחבר למערכת.");
          setLoading(false);
          return;
        }

        const [userRes, postsRes] = await Promise.all([
          axios.get(`/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/cards?user_id=${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfileUser(userRes.data);
        setPosts(postsRes.data);

        if (userRes.data._id === user?._id) {
          setIsUserLoggedIn(true);
        }
      } catch (err) {
        console.error("שגיאה בטעינת פרופיל:", err);
        setError("לא ניתן לטעון את פרטי המשתמש או הפוסטים.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const shouldAutoplay = posts.length > 1;

  const sliderSettings = {
    dots: true,
    infinite: shouldAutoplay,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: shouldAutoplay,
    autoplaySpeed: 4500,
    rtl: true,
    nextArrow: isMobileView ? null : <NextArrow />,
    prevArrow: isMobileView ? null : <PrevArrow />,
  };

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
      <Box display="flex" flexDirection="column" gap={4}>
        <Card
          sx={{
            p: 3,
            pt: 4,
            boxShadow: 4,
            borderRadius: 4,
            maxWidth: 420,
            mx: "auto",
            borderLeft: "6px solid",
            borderColor: "primary.main",
            backgroundColor: "background.paper",
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
                  background: profileUser?.image
                    ? "transparent"
                    : "linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)", 
                  color: "white",
                }}
                src={profileUser?.image || undefined} 
              >
                {profileUser?.firstName?.[0]}{" "}
              </Avatar>

              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {profileUser?.firstName} {profileUser?.lastName}
              </Typography>

              {profileUser?.nickname && (
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  🧑‍💻 כינוי: {profileUser.nickname}
                </Typography>
              )}

              <Typography variant="body2" color="text.secondary">
                {isUserLoggedIn ? "אתה מחובר!" : "לא מחובר"}
              </Typography>

              {isUserLoggedIn && (
                <Box mt={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    href="/edit-profile"
                    sx={{ borderRadius: 2 }}
                  >
                    ערוך פרטים
                  </Button>
                </Box>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />
          </CardContent>
        </Card>

        {posts.length === 0 ? (
          <Alert severity="info" sx={{ mx: "auto", maxWidth: 600 }}>
            המשתמש עדיין לא פרסם פוסטים.
          </Alert>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              px: { xs: 0, sm: 2 },
              boxSizing: "border-box",
            }}
          >
            <Box sx={{ maxWidth: 850, mx: "auto" }}>
              <Slider {...sliderSettings}>
                {posts.map((post) => (
                  <Box key={post._id} px={1}>
                    <PostCard {...post} currentUserId={user?._id} />
                  </Box>
                ))}
              </Slider>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
