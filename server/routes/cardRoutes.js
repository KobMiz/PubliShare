const express = require("express");
const mongoose = require("mongoose");
const Card = require("../models/cardModel");
const { cardSchema, commentSchema } = require("../validators/cardValidator");
const authMiddleware = require("../middlewares/authMiddleware");
const { toggleLike, addComment } = require("../controllers/cardController");

const router = express.Router();

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Retrieve posts (optionally filtered by user)
 *     description: Retrieve all posts, or only those created by a specific user if 'user_id' is provided.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *         description: Filter posts by the ID of the user who created them
 *     responses:
 *       200:
 *         description: List of posts (filtered or all)
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = {};

    if (req.query.user_id) {
      filter.user_id = req.query.user_id;
    }

    const posts = await Card.find(filter)
      .populate("user_id", "firstName lastName avatar")
      .populate("comments.user_id", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    console.error("❌ Error retrieving posts:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Retrieve a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Post details
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post ID format." });
    }

    const post = await Card.findById(id)
      .populate("user_id", "firstName lastName avatar")
      .populate("comments.user_id", "firstName lastName");

    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error("❌ Error retrieving post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                   alt:
 *                     type: string
 *               video:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authMiddleware, async (req, res) => {
  const { error } = cardSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const newPost = new Card({
      ...req.body,
      user_id: req.user._id,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /cards/{id}:
 *   patch:
 *     summary: Update an existing post
 *     description: Update the details of a specific post by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               image:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                   alt:
 *                     type: string
 *               video:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       404:
 *         description: Post not found
 *       400:
 *         description: Invalid post ID
 */
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Card.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.user_id.toString() === req.user._id || req.user.isAdmin) {
      const { text, image, video, link } = req.body;
      post.text = text || post.text;
      post.image = image || post.image;
      post.video = video || post.video;
      post.link = link || post.link;

      await post.save();
      res.status(200).json(post);
    } else {
      res
        .status(403)
        .json({ error: "You do not have permission to edit this post." });
    }
  } catch (err) {
    console.error("❌ Error updating post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Allow a user to delete their own post, or allow an admin to delete any post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to be deleted
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Access denied – not your post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { _id, isAdmin } = req.user;

    const post = await Card.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    if (post.user_id.toString() !== _id && !isAdmin) {
      return res.status(403).json({
        error: "Access denied. You can only delete your own posts.",
      });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully." });
  } catch (err) {
    console.error("❌ Error deleting post:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /cards/{id}/like:
 *   patch:
 *     summary: Toggle like on a post
 *     description: Add or remove a like for the given post by the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to like/unlike
 *     responses:
 *       200:
 *         description: Post like toggled successfully
 *       404:
 *         description: Post not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/:id/like", authMiddleware, toggleLike);

/**
 * @swagger
 * /cards/{id}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     description: Add a new comment to the specified post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Validation error or bad input
 *       404:
 *         description: Post not found
 */
router.post("/:id/comments", authMiddleware, async (req, res) => {
  const { error } = commentSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  return require("../controllers/cardController").addComment(req, res);
});

/**
 * @swagger
 * /cards/{postId}/comments/{commentId}:
 *   patch:
 *     summary: Edit a comment
 *     description: Edit an existing comment by its ID on a specific post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Validation error or invalid ID
 *       403:
 *         description: Unauthorized to edit comment
 *       404:
 *         description: Post or comment not found
 */
router.patch("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text } = req.body;
    const { _id, isAdmin } = req.user;

    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Comment text is required." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(commentId)
    ) {
      return res.status(400).json({ error: "Invalid post or comment ID." });
    }

    const post = await Card.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found." });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found." });

    const isOwner = comment.user_id.toString() === _id;
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "You can only edit your own comments." });
    }

    
    comment.text = text;
    await post.save();

    res.json({ message: "Comment updated successfully.", comment });
  } catch (err) {
    console.error("❌ Error updating comment:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

/**
 * @swagger
 * /cards/{postId}/comments/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by its ID from a specific post.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment to delete
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Post or comment not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;

      const updatedPost = await Card.findByIdAndUpdate(
        postId,
        { $pull: { comments: { _id: commentId } } },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post or comment not found." });
      }

      res
        .status(200)
        .json({
          message: "Comment deleted successfully",
          comments: updatedPost.comments,
        });
    } catch (err) {
      console.error("❌ Error deleting comment:", err);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    }
  }
);


module.exports = router;
