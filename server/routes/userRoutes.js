const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../validators/userValidator");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("../swaggerConfig"); 

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });



/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user with optional profile image.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               nickname:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               password:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or email exists
 */
router.post("/register", upload.single("profileImage"), async (req, res) => {
  const {
    firstName,
    lastName,
    nickname,
    email,
    phone,
    country,
    birthdate,
    password,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    // הצפנת הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10);

    const imagePath = req.file
      ? `http://localhost:3000/${req.file.path.replace(/\\/g, "/")}`
      : undefined;

    const newUser = new User({
      firstName,
      lastName,
      nickname,
      email,
      phone,
      country,
      birthdate,
      password: hashedPassword,
      image: imagePath,
    });

    await newUser.save();

    const token = jwt.sign(
      { _id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );

    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        nickname: newUser.nickname,
        image: newUser.image || null,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate a user and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Account locked
 *       404:
 *         description: User not found
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "4h" }
    );
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        firstName: user.firstName,
        lastName: user.lastName,
        nickname: user.nickname,
        image: user.image || null,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});


/**
 * @swagger
 * /users/profile-image:
 *   post:
 *     summary: Upload user profile image
 *     description: Upload a profile image for the logged-in user.
 */
router.post(
  "/profile-image",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imagePath = `http://localhost:3000/${req.file.path.replace(
      /\\/g,
      "/"
    )}`;

    try {
      await User.findByIdAndUpdate(req.user._id, { image: imagePath });
      res.json({ message: "Image uploaded successfully", imagePath });
    } catch (error) {
      res.status(500).json({ error: "Error saving image" });
    }
  }
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findById(req.params.id).select(
      "firstName lastName nickname image country birthdate"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving user" });
  }
});

/**
 * @swagger
 * /users/user-profile/{id}:
 *   get:
 *     summary: View another user's profile
 */
router.get("/user-profile/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName nickname image country birthdate"
    );
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error fetching user profile" });
  }
});

router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
});

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedUser)
        return res.status(404).json({ error: "User not found" });

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ error: "Error updating user" });
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser)
        return res.status(404).json({ error: "User not found" });

      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
);

module.exports = router;
