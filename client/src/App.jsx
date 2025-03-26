import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

// רכיבי עיצוב קבועים
import Navbar from "./components/layout/navbar";
import Footer from "./components/layout/footer";

// דפים
import Home from "./pages/home";
import EditProfile from "./pages/editProfile";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import About from "./pages/about";
import Contact from "./pages/contact";
import PostDetails from "./pages/postDetails";
import OtherUserProfile from "./pages/otherUserProfile";
import CreatePost from "./pages/CreatePost";
import Favorites from "./pages/favorites";
import EditPost from "./pages/editPost"; // ייבוא דף עריכת הפוסט

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      dispatch({ type: "user/login/fulfilled", payload: { user, token } });
    }
  }, [dispatch]);

  return (
    <div className="app-container" dir="rtl">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/users/user-profile/:id"
            element={<OtherUserProfile />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/post/:postId" element={<PostDetails />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/edit/:postId" element={<EditPost />} />{" "}
          {/* נתיב עריכת פוסט */}
          <Route
            path="*"
            element={
              <h1 style={{ textAlign: "center", marginTop: "50px" }}>
                404 - הדף לא נמצא
              </h1>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
