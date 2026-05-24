const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  const remoteUri = process.env.MONGODB_URI;
  const NODE_ENV = process.env.NODE_ENV || "development";
  
  // In production, MONGODB_URI is REQUIRED
  if (NODE_ENV === "production" && !remoteUri) {
    console.error(
      "❌ FATAL: MONGODB_URI environment variable must be set in production"
    );
    process.exit(1);
  }
  
  const localUri = "mongodb://127.0.0.1:27017/waleed_project";
  const uriToTry = remoteUri || localUri;

  const connect = async (uri) => {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  };

  const connectMemoryDb = async () => {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Memory Server connected: running in-memory database");
    return true;
  };

  try {
    await connect(uriToTry);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    if (remoteUri && remoteUri !== localUri) {
      try {
        console.log("Trying local MongoDB fallback at mongodb://127.0.0.1:27017/waleed_project");
        await connect(localUri);
        return true;
      } catch (fallbackError) {
        console.error("❌ Local MongoDB fallback failed:", fallbackError.message);
        console.log("Starting in-memory MongoDB server as fallback.");
        await connectMemoryDb();
        return true;
      }
    } else {
      console.log("Starting in-memory MongoDB server as fallback.");
      await connectMemoryDb();
      return true;
    }
  }
};

module.exports = connectDB;