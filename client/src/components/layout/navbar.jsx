import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Container,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  ContactMail as ContactIcon,
  Person as PersonIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  HowToReg as RegisterIcon,
  Menu as MenuIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Add as AddIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useTheme, alpha } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import { toggleMode } from "../../store/themeSlice";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchResults from "../common/SearchResults";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutAnchorEl, setAboutAnchorEl] = useState(null);
  const searchRef = useRef();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isAlmostDesktop = useMediaQuery(
    "(min-width:900px) and (max-width:1150px)"
  );
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setQuery("");
    setResults(null);
    setShowResults(false);
  }, [location.pathname]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setResults(null);
        setShowResults(false);
        return;
      }
      try {
        if (!token) return;
        const res = await fetch(`/search?q=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setResults(data);
          setShowResults(true);
        } else {
          setResults(null);
          setShowResults(false);
        }
      } catch (err) {
        console.error("Search error:", err);
        setResults(null);
        setShowResults(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/about");
  };

  const handleSearchSubmit = (e) => e.preventDefault();
  const handleOpenAboutMenu = (e) => setAboutAnchorEl(e.currentTarget);
  const handleCloseAboutMenu = () => setAboutAnchorEl(null);

  const menuItems = [
    ...(user
      ? [
          {
            label: "פרופיל",
            path: `/profile/${user._id}`,
            icon: <PersonIcon sx={{ ml: 1 }} />,
          },
          {
            label: "התנתקות",
            action: handleLogout,
            icon: <LogoutIcon sx={{ ml: 1 }} />,
          },
          { label: "דף הבית", path: "/", icon: <HomeIcon sx={{ ml: 1 }} /> },
          {
            label: "מועדפים",
            path: "/favorites",
            icon: <FavoriteIcon sx={{ ml: 1 }} />,
          },
        ]
      : [
          {
            label: "התחבר",
            path: "/login",
            icon: <LoginIcon sx={{ ml: 1 }} />,
          },
          {
            label: "הרשמה",
            path: "/register",
            icon: <RegisterIcon sx={{ ml: 1 }} />,
          },
        ]),
    { label: "כללי", icon: <MenuBookIcon sx={{ ml: 1 }} />, submenu: true },
  ];

  const renderMenuItems = () =>
    menuItems.map(({ label, path, action, icon, submenu }) =>
      submenu ? (
        <Box key="כללי">
          <Button
            color="inherit"
            startIcon={icon}
            onClick={handleOpenAboutMenu}
          >
            כללי
          </Button>
          <Menu
            anchorEl={aboutAnchorEl}
            open={Boolean(aboutAnchorEl)}
            onClose={handleCloseAboutMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            dir="rtl"
          >
            <MenuItem
              onClick={() => {
                handleCloseAboutMenu();
                navigate("/about");
              }}
            >
              <InfoIcon sx={{ ml: 1 }} /> אודות
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleCloseAboutMenu();
                navigate("/contact");
              }}
            >
              <ContactIcon sx={{ ml: 1 }} /> צור קשר
            </MenuItem>
          </Menu>
        </Box>
      ) : (
        <Button
          key={label}
          color="inherit"
          onClick={action || (() => navigate(path))}
          startIcon={icon}
        >
          {label}
        </Button>
      )
    );

  return (
    <AppBar position="static" color="primary" dir="rtl">
      <Container maxWidth="lg">
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 1,
          }}
        >
          {isDesktop && !isAlmostDesktop && (
            <Box sx={{ display: "flex", gap: 1, order: 1 }}>
              <Tooltip title={isDarkMode ? "מצב בהיר" : "מצב כהה"}>
                <IconButton
                  color="inherit"
                  onClick={() => dispatch(toggleMode())}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              {renderMenuItems()}
            </Box>
          )}

          {user && isDesktop && !isAlmostDesktop && (
            <Tooltip title="צור פוסט חדש">
              <IconButton
                color="inherit"
                onClick={() => navigate("/create")}
                sx={{ order: 2 }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          )}

          {(isTablet || isDesktop || isAlmostDesktop) && user && (
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              ref={searchRef}
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexGrow: 1,
                justifyContent: "center",
                order: 3,
              }}
            >
              <TextField
                size="small"
                variant="outlined"
                placeholder="חיפוש..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.08)
                      : "#fff",
                  borderRadius: 1,
                  width: isTablet ? "180px" : "250px",
                  input: {
                    textAlign: "right",
                    color: theme.palette.text.primary,
                    "&::placeholder": {
                      color:
                        theme.palette.mode === "dark"
                          ? alpha(theme.palette.common.white, 0.5)
                          : "#888",
                    },
                  },
                  fieldset: {
                    borderColor:
                      theme.palette.mode === "dark"
                        ? "#666"
                        : "rgba(0, 0, 0, 0.23)",
                  },
                }}
              />
              <IconButton type="submit" color="inherit">
                <SearchIcon />
              </IconButton>
              {showResults && results && (
                <SearchResults
                  results={results}
                  onClose={() => setShowResults(false)}
                />
              )}
            </Box>
          )}

          <Typography
            variant="h6"
            component={NavLink}
            to={user ? "/" : "/about"}
            sx={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              order: 4,
              ml: 2,
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: "1.6rem",
              direction: "ltr",
            }}
          >
            PubliSh
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                fontSize: "inherit",
              }}
            >
              <ShareIcon sx={{ fontSize: "1.4rem", verticalAlign: "middle" }} />
            </Box>
            are
          </Typography>

          {(isMobile || isTablet || isAlmostDesktop) && (
            <IconButton
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ order: 0 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 250, px: 2, py: 2 }} role="presentation">
          <Box
            component="form"
            onSubmit={(e) => e.preventDefault()}
            sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
          >
            <TextField
              size="small"
              variant="outlined"
              placeholder="חיפוש..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
              sx={{
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.08)
                    : "#fff",
                borderRadius: 1,
                input: {
                  textAlign: "right",
                  color: theme.palette.text.primary,
                  "&::placeholder": {
                    color:
                      theme.palette.mode === "dark"
                        ? alpha(theme.palette.common.white, 0.5)
                        : "#888",
                  },
                },
                fieldset: {
                  borderColor:
                    theme.palette.mode === "dark"
                      ? "#666"
                      : "rgba(0, 0, 0, 0.23)",
                },
              }}
            />
            {showResults && results && (
              <Box sx={{ mt: 2 }}>
                <SearchResults
                  results={results}
                  onClose={() => setShowResults(false)}
                  insideDrawer
                />
              </Box>
            )}
          </Box>
          <Divider sx={{ mb: 1 }} />
          <List>
            {user && (
              <ListItem
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/create");
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText
                  primary="צור פוסט חדש"
                  sx={{ textAlign: "right" }}
                />
              </ListItem>
            )}
            {menuItems.map(({ label, path, action, icon, submenu }) =>
              submenu ? (
                <React.Fragment key="כללי">
                  <ListItem
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/about");
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                      <InfoIcon />
                    </ListItemIcon>
                    <ListItemText primary="אודות" sx={{ textAlign: "right" }} />
                  </ListItem>
                  <ListItem
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/contact");
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                      <ContactIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="צור קשר"
                      sx={{ textAlign: "right" }}
                    />
                  </ListItem>
                </React.Fragment>
              ) : (
                <ListItem
                  key={label}
                  onClick={() => {
                    setMobileOpen(false);
                    action ? action() : navigate(path);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} sx={{ textAlign: "right" }} />
                </ListItem>
              )
            )}
            <Divider sx={{ my: 1 }} />
            <ListItem onClick={() => dispatch(toggleMode())}>
              <ListItemIcon sx={{ minWidth: "auto", ml: 1 }}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText
                primary={isDarkMode ? "מצב בהיר" : "מצב כהה"}
                sx={{ textAlign: "right" }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
