const express = require("express");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { userSchema } = require("../validators/userValidator");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

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
 *     description: Register a user with optional profile image upload.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
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
 *         description: Email already exists
 *       500:
 *         description: Server error
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
 *             required:
 *               - email
 *               - password
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
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
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
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Error saving image
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
 *     summary: Get own profile
 *     description: Retrieve the authenticated user's full profile by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
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
 * /users/profile-image:
 *   delete:
 *     summary: Delete the user's profile image
 *     description: Allows a logged-in user to reset their profile picture to default.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image reset successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.delete("/profile-image", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const defaultImageUrl =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    // אם אין בכלל תמונה ייחודית למשתמש (כבר תמונת ברירת מחדל)
    if (!user.image || user.image.includes("blank-profile-picture")) {
      user.image = defaultImageUrl;
      await user.save();
      return res.status(200).json({
        message: "No custom image to delete. Reset to default.",
        image: user.image,
      });
    }

    // אם כן קיימת תמונה אמיתית על השרת – מחק אותה
    const serverImagePath = user.image.replace("http://localhost:3000/", "");
    const absolutePath = path.join(__dirname, "..", serverImagePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    user.image = defaultImageUrl;
    await user.save();

    res.status(200).json({
      message: "Profile image reset to default successfully.",
      image: user.image,
    });
  } catch (error) {
    console.error("❌ Error deleting profile image:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /users/user-profile/{id}:
 *   get:
 *     summary: View public profile of another user
 *     description: Retrieve public profile fields of another user by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
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

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update user profile
 *     description: Allows a user to update their own profile details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               nickname:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               birthdate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user._id !== req.params.id && !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const updatedData = {
      firstName: req.body.firstName || user.firstName,
      lastName: req.body.lastName || user.lastName,
      nickname: req.body.nickname || user.nickname,
      phone: req.body.phone || user.phone,
      country: req.body.country || user.country,
      birthdate: req.body.birthdate || user.birthdate,
      image: req.body.image || user.image,
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: "Error updating user" });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Admin - Update any user profile
 *     description: Allows an admin to update any user's full details.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Admin - Delete a user
 *     description: Allows an admin to delete a user by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
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
