import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/common/PostCard";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const { token, user } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchCards = async () => {
      if (!token) {
        setError("אין אפשרות לטעון כרטיסים – אנא התחבר תחילה.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get("/cards", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 פוסטים שהתקבלו:", data);
        setCards(data);
      } catch (err) {
        console.error("❌ שגיאה בעת שליפת כרטיסים:", err);

        if (err.response) {
          if (err.response.status === 429) {
            setError(err.response.data);
          } else if (err.response.status === 401) {
            setError(err.response.data.error);
            localStorage.removeItem("token");
            setTimeout(() => (window.location = "/login"), 3000);
          } else {
            setError("אירעה שגיאה בעת טעינת הכרטיסים. ודא שאתה מחובר.");
          }
        } else {
          setError("אירעה שגיאת רשת. אנא נסה שוב מאוחר יותר.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [token]);

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

  const sortedCards = [...cards].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
          minHeight: "100vh",
          py: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary"
            sx={{
              mb: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            are
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShareIcon fontSize="inherit" />
            </motion.span>
            Publish
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => navigate("/create")}
            sx={{ mt: 2, px: 4, py: 1.5, fontSize: "1rem" }}
          >
            צור פוסט חדש
          </Button>
        </Box>

        {sortedCards.length === 0 ? (
          <Alert severity="info" sx={{ textAlign: "center" }}>
            אין כרטיסים זמינים להצגה כרגע.
          </Alert>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {sortedCards.map((card) => (
              <Grid item xs={12} sm={10} md={6} key={card._id}>
                <PostCard {...card} currentUserId={user?._id} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </motion.div>
  );
};

export default Home;
