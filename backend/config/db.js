const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri || uri.includes("127.0.0.1")) {
    // Use in-memory MongoDB for local development
    const mongoServer = await MongoMemoryServer.create();
    uri = mongoServer.getUri();
    console.log("🔄 Using in-memory MongoDB for development");
  }

  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
};

module.exports = connectDB;
