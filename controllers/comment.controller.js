import Comment from "../models/Comment.model.js";
import Novel from "../models/Novel.model.js";
import mongoose from "mongoose";

// Create Comment
export const createComment = async (req, res) => {
  const { novelId } = req.params;
  const { comment, stars } = req.body;

  try {
    const novel = await Novel.findById(novelId);
    if (!novel) return res.status(404).json({ error: "Novel not found" });

    const existing = await Comment.findOne({ user: req.user._id, novel: novelId });
    if (existing) {
      return res.status(400).json({ error: "You have already commented on this novel" });
    }

    const newComment = new Comment({
      novel: novelId,
      user: req.user._id,
      comment,
      stars,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get comments for a novel
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ novel: req.params.novelId })
      .populate("user", "username profileImg")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get average rating for a novel
export const getAverageRating = async (req, res) => {
  try {
    const result = await Comment.aggregate([
      { $match: { novel: new mongoose.Types.ObjectId(req.params.novelId), stars: { $exists: true } } },
      { $group: { _id: "$novel", averageRating: { $avg: "$stars" } } }
    ]);

    const avg = result.length > 0 ? result[0].averageRating : 0;
    res.status(200).json({ averageRating: parseFloat(avg.toFixed(1)) });
  } catch (error) {
    console.error("Error getting average rating:", error);
    res.status(500).json({ error: error.message });
  }
};
