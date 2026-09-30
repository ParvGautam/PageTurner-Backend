import mongoose from "mongoose";
import dns from "node:dns";

// Use public DNS (Google DNS) to resolve MongoDB SRV records
// Prevents querySrv ECONNREFUSED errors caused by local ISP/router DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
