import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
  useMediaQuery,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostCard from "../components/common/PostCard";
import Slider from "react-slick";
import axios from "axios";
import { useSelector } from "react-redux";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const NextArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "45%",
      right: -15,
      zIndex: 2,
      bgcolor: "white",
      boxShadow: 2,
      ":hover": { bgcolor: "grey.200" },
    }}
  >
    <ArrowForwardIos />
  </IconButton>
);

const PrevArrow = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      top: "45%",
      left: -15,
      zIndex: 2,
      bgcolor: "white",
      boxShadow: 2,
      ":hover": { bgcolor: "grey.200" },
    }}
  >
    <ArrowBackIos />
  </IconButton>
);

const Favorites = () => {
  const { token, user } = useSelector((state) => state.user);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const isMobileView = useMediaQuery("(max-width:899px)");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const { data } = await axios.get("/cards", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const liked = data.filter((card) => card.likes.includes(user._id));
        setFavorites(liked);
      } catch (err) {
        console.error("שגיאה בשליפת מועדפים:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [token, user._id]);

  const shouldAutoplay = favorites.length > 1;

  const sliderSettings = {
    dots: true,
    infinite: shouldAutoplay,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: shouldAutoplay,
    autoplaySpeed: 4000,
    rtl: true,
    nextArrow: isMobileView ? null : <NextArrow />,
    prevArrow: isMobileView ? null : <PrevArrow />,
  };

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" fontWeight="bold" mb={4} color="primary">
        <FavoriteIcon color="error" sx={{ verticalAlign: "middle", mr: 1 }} />
        My Favorites
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : favorites.length === 0 ? (
        <Alert severity="info">עדיין לא סימנת פוסטים בלייק.</Alert>
      ) : (
        <Box sx={{ position: "relative", maxWidth: 850, mx: "auto" }}>
          <Slider {...sliderSettings}>
            {favorites.map((post) => (
              <Box key={post._id} px={1}>
                <PostCard {...post} currentUserId={user._id} />
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </Box>
  );
};

export default Favorites;
