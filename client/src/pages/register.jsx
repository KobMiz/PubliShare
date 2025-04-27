import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Snackbar,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage } = useSelector(
    (state) => state.user
  );

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("שדה חובה"),
    lastName: Yup.string().required("שדה חובה"),
    nickname: Yup.string().max(50).required("שדה חובה"),
    email: Yup.string().email("אימייל לא תקין").required("שדה חובה"),
    password: Yup.string().min(8, "לפחות 8 תווים").required("שדה חובה"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "מספר טלפון חייב להיות 10 ספרות")
      .required("שדה חובה"),
    country: Yup.string().required("שדה חובה"),
    birthdate: Yup.date().required("שדה חובה"),
    image: Yup.string().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      nickname: "",
      email: "",
      password: "",
      phone: "",
      country: "",
      birthdate: "",
      image: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (file && values.image) {
        setSnackbarOpen(true);
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (file) {
        formData.append("profileImage", file);
        formData.delete("image");
      }

      const result = await dispatch(register(formData));
      if (register.fulfilled.match(result)) {
        navigate("/login");
      }
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      formik.setFieldValue("image", "");
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    formik.setFieldValue("image", url);
    setPreview(url);
    setFile(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm" dir="rtl">
      <Typography variant="h4" align="center" gutterBottom>
        הרשמה
      </Typography>

      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <TextField
          label="שם פרטי"
          name="firstName"
          fullWidth
          margin="normal"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          label="שם משפחה"
          name="lastName"
          fullWidth
          margin="normal"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          label="כינוי"
          name="nickname"
          fullWidth
          margin="normal"
          value={formik.values.nickname}
          onChange={formik.handleChange}
          error={formik.touched.nickname && Boolean(formik.errors.nickname)}
          helperText={formik.touched.nickname && formik.errors.nickname}
        />
        <TextField
          label="אימייל"
          name="email"
          fullWidth
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          label="סיסמה"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          label="טלפון"
          name="phone"
          fullWidth
          margin="normal"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && Boolean(formik.errors.phone)}
          helperText={formik.touched.phone && formik.errors.phone}
        />
        <TextField
          label="מדינה"
          name="country"
          fullWidth
          margin="normal"
          value={formik.values.country}
          onChange={formik.handleChange}
          error={formik.touched.country && Boolean(formik.errors.country)}
          helperText={formik.touched.country && formik.errors.country}
        />
        <TextField
          label="תאריך לידה"
          name="birthdate"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          value={formik.values.birthdate}
          onChange={formik.handleChange}
          error={formik.touched.birthdate && Boolean(formik.errors.birthdate)}
          helperText={formik.touched.birthdate && formik.errors.birthdate}
        />

        <TextField
          label="קישור URL לתמונה (אופציונלי)"
          name="image"
          fullWidth
          margin="normal"
          value={formik.values.image}
          onChange={handleImageUrlChange}
          error={formik.touched.image && Boolean(formik.errors.image)}
          helperText={formik.touched.image && formik.errors.image}
        />

        <Box textAlign="center" mt={2}>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="profile-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="profile-upload">
            <Button variant="outlined" component="span">
              העלאת תמונה מהמחשב
            </Button>
          </label>

          {preview && (
            <Avatar
              src={preview}
              alt="תצוגה מקדימה"
              sx={{ width: 80, height: 80, mt: 2, mx: "auto" }}
            />
          )}
        </Box>

        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box mt={3}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "הירשם"}
          </Button>
        </Box>
      </form>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message="יש לבחור קובץ או קישור – לא את שניהם."
      />
    </Container>
  );
};

export default Register;
