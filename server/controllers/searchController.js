const User = require("../models/userModel");
const Card = require("../models/cardModel");
const mongoose = require("mongoose");

const searchAll = async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "יש לספק מחרוזת חיפוש." });
  }

  const searchRegex = new RegExp(query, "i"); 

  try {
    const users = await User.find({
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { nickname: searchRegex },
        { email: searchRegex },
      ],
    }).select("firstName lastName nickname email image _id");

    const cards = await Card.find({
      text: searchRegex,
    })
      .populate("user_id", "nickname image")
      .select("text image video link user_id _id");

    const commentsResults = await Card.aggregate([
      { $unwind: "$comments" },
      {
        $match: {
          "comments.text": searchRegex,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.user_id",
          foreignField: "_id",
          as: "commentUser",
        },
      },
      {
        $project: {
          commentText: "$comments.text",
          commentId: "$comments._id",
          cardId: "$_id",
          commentUser: { $arrayElemAt: ["$commentUser", 0] },
        },
      },
    ]);

    const comments = commentsResults.map((c) => ({
      _id: c.commentId,
      cardId: c.cardId,
      text: c.commentText,
      user: {
        _id: c.commentUser?._id,
        nickname: c.commentUser?.nickname,
        image: c.commentUser?.image,
      },
    }));

    res.json({ users, posts: cards, comments });
  } catch (err) {
    console.error("❌ שגיאה בחיפוש:", err);
    res.status(500).json({ error: "שגיאה בעת ביצוע החיפוש." });
  }
};

module.exports = { searchAll };
