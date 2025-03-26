const mongoose = require("mongoose");
const Card = require("../models/cardModel");

const toggleLike = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(cardId)) {
      return res.status(400).json({ error: "Invalid card ID" });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    const userIndex = card.likes.findIndex((id) => id.equals(userId));

    if (userIndex === -1) {
      card.likes.push(userId);
    } else {
      card.likes.splice(userIndex, 1);
    }

    await card.save();

    res.json({
      message: "Like toggled successfully",
      cardId: card._id,
      likesCount: card.likes.length,
      isLikedByCurrentUser: userIndex === -1,
    });
  } catch (error) {
    console.error("Error in toggleLike:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addComment = async (req, res) => {
  try {
    const cardId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid card ID" });
    }

    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      user_id: userId,
      text,
    };

    card.comments.push(newComment);
    await card.save();

    const updatedCard = await Card.findById(cardId).populate(
      "comments.user_id",
      "firstName lastName"
    );

    res.status(201).json({
      message: "Comment added successfully",
      comments: updatedCard.comments,
    });
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  toggleLike,
  addComment,
};
