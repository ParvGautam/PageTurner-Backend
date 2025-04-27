import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import novelRoutes from "./routes/novel.route.js";
import chapterRoutes from "./routes/chapter.route.js";
import commentRoutes from "./routes/comment.route.js";
import progressRoutes from "./routes/progress.route.js";
import bookmarkRoutes from "./routes/bookmark.route.js";
import followRoutes from "./routes/follow.route.js";
import libraryRoutes from "./routes/library.route.js";
import cors from 'cors';

dotenv.config();
const app = express();

// CORS configuration
app.use(cors({
	origin: function (origin, callback) {
	  const allowedOrigins = ['http://localhost:5173', 'https://page-turner-theta.vercel.app'];
	  if (!origin || allowedOrigins.includes(origin)) {
		callback(null, true);
	  } else {
		callback(new Error('Not allowed by CORS'));
	  }
	},
	credentials: true
  }));

app.use(cookieParser());

// Increase payload size limit for JSON requests (10MB)
app.use(express.json({ limit: '10mb' }));
// Increase payload size limit for URL-encoded requests (10MB)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/", (req, res) => {
	res.send("API Is Running");
});

const PORT = process.env.PORT || 7000;

app.use("/api/auth", authRoutes);
app.use("/api/novels", novelRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/user", followRoutes);
app.use("/api/library", libraryRoutes);

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server is running on port ${PORT}`);
	connectDB();
});
