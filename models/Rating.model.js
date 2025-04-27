// models/Rating.model.js
import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    novel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Novel",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Ensure user can rate a novel only once
ratingSchema.index({ novel: 1, user: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
