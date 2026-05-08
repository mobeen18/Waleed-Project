const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.warn("⚠️  Running in DEMO MODE without persistent database.");
    console.warn("💡 To use MongoDB:");
    console.warn("   1. Install MongoDB locally: https://www.mongodb.com/try/download/community");
    console.warn("   2. Start MongoDB service");
    console.warn("   3. Or update MONGODB_URI in .env to a working connection");
    return false;
  }
};

module.exports = connectDB;