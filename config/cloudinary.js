import cloudinary from "cloudinary";
import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

// Log the configuration (redacting secrets)
console.log("Cloudinary Configuration:");
console.log("- Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME || "MISSING");
console.log("- API Key:", process.env.CLOUDINARY_API_KEY ? "PRESENT" : "MISSING");
console.log("- API Secret:", process.env.CLOUDINARY_API_SECRET ? "PRESENT" : "MISSING");

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;
