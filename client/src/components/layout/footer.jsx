import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: isDark ? "#1e1e1e" : "#f4f4f4",
        borderTop: "1px solid #ccc",
        mt: "auto",
        px: 2,
        py: 1,
        width: "100%",
        textAlign: "center",
        fontSize: "0.75rem",
        color: isDark ? "#fff" : "#000",
      }}
    >
      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: "0.8rem" }}>
        PubliShare
      </Typography>
      <Typography
        variant="caption"
        sx={{ fontSize: "0.75rem", color: isDark ? "#ccc" : "text.secondary" }}
      >
        {new Date().getFullYear()} © כל הזכויות שמורות
      </Typography>
    </Box>
  );
};

export default Footer;
