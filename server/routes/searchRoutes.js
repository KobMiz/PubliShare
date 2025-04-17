const express = require("express");
const router = express.Router();
const { searchAll } = require("../controllers/searchController");
const authMiddleware = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Global search across users, posts, and comments
 *     description: Performs a case-insensitive search across multiple collections (users, posts, comments) using a query string.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: The search string to query (e.g., username, post text, comment).
 *     responses:
 *       200:
 *         description: Search results (may include users, posts, and/or comments)
 *       400:
 *         description: Missing or invalid query parameter
 *       401:
 *         description: Unauthorized - token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, searchAll);

module.exports = router;
