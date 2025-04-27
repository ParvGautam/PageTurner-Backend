import mongoose from "mongoose";

const librarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    novel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create a compound index to prevent duplicate entries
librarySchema.index({ user: 1, novel: 1 }, { unique: true });

const Library = mongoose.model("Library", librarySchema);

export default Library; 