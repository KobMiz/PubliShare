const express = require("express");
const router = express.Router();
const { searchAll } = require("../controllers/searchController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware, searchAll);

module.exports = router;
