import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  novel: { type: mongoose.Schema.Types.ObjectId, ref: "Novel", required: true },
  chapter: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter", required: true },
  lastReadAt: { type: Date, default: Date.now },
}, { timestamps: true });

// Compound index for user and novel to ensure users have only one progress record per novel
progressSchema.index({ user: 1, novel: 1 }, { unique: true });

const ReadingProgress = mongoose.model("ReadingProgress", progressSchema);

export default ReadingProgress;
