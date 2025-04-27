import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
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
  comment: {
    type: String,
    trim: true,
  },
  stars: {
    type: Number,
    min: 1,
    max: 10,
  },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
