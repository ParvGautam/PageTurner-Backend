import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Novel",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  chapterNumber: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Chapter = mongoose.model("Chapter", chapterSchema);

export default Chapter;
