import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Avatar,
  Paper,
} from "@mui/material";
import ContactMailIcon from "@mui/icons-material/ContactMail";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", msg: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", msg: "" });

    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", msg: data.message });
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus({ type: "error", msg: data.error || "שגיאה בשליחת הטופס" });
      }
    } catch (err) {
      setStatus({ type: "error", msg: "אירעה שגיאה. נסה שוב מאוחר יותר." });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6, direction: "rtl" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: "primary.main", mb: 1 }}>
            <ContactMailIcon />
          </Avatar>
          <Typography variant="h5" gutterBottom>
            צור קשר
          </Typography>
          <Typography variant="body1" align="center">
            נשמח לשמוע ממך! מלא את הטופס ונחזור אליך בהקדם.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="שם מלא"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="כתובת אימייל"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
          <TextField
            label="הודעה"
            name="message"
            multiline
            rows={4}
            value={form.message}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 2 }}
          />

          {status.msg && (
            <Alert severity={status.type} sx={{ mb: 2 }}>
              {status.msg}
            </Alert>
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            שלח
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Contact;
  