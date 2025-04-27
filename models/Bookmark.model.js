import mongoose from "mongoose";

const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  novel: { type: mongoose.Schema.Types.ObjectId, ref: "Novel", required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Compound index for user, novel and chapter to ensure uniqueness
bookmarkSchema.index({ user: 1, novel: 1, chapter: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark; 