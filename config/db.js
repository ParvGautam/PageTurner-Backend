import mongoose from "mongoose";
import dns from "node:dns";

// Use public DNS (Google DNS) to resolve MongoDB SRV records
// Prevents querySrv ECONNREFUSED errors caused by local ISP/router DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is missing from environment variables");
    throw new Error("MONGO_URI is missing from environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => {
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }

  return cached.conn;
};

export default connectDB;
