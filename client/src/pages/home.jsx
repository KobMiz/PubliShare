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
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/common/PostCard";
import { useTheme } from "@mui/material/styles"; 

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          variant="h4"
          gutterBottom
          sx={{ color: isDarkMode ? "white" : "black" }} 
        >
          ברוכים הבאים ל־PubliShare!
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: isDarkMode ? "grey.300" : "text.secondary" }} 
        >
          כאן תוכלו לגלול בין הפוסטים הכי חדשים ששיתפו משתמשים.
        </Typography>
      </Box>

      <Box textAlign="center" mb={4}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          onClick={() => navigate("/create")}
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
  );
};

export default Home;
