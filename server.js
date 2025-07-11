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

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://page-turner-theta.vercel.app",
			"https://page-turner-git-main-akashs-projects-4f8b6545.vercel.app",
			"https://page-turner-akashs-projects-4f8b6545.vercel.app"
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// This is critical for cookies to work properly
app.set('trust proxy', 1);

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
