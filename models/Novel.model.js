import mongoose from "mongoose";

const novelSchema = new mongoose.Schema({
  title: String,
  description: String,
  genre: String,
  thumbnail: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
  rating: { type: Number, default: 0 },
  raters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

const Novel = mongoose.model("Novel", novelSchema);

export default Novel;
