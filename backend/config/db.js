const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  const remoteUri = process.env.MONGODB_URI;
  const localUri = "mongodb://127.0.0.1:27017/waleed_project";
  const uriToTry = remoteUri || localUri;

  const connect = async (uri) => {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  };

  const connectMemoryDb = async () => {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Memory Server connected: running in-memory database");
    return conn;
  };

  try {
    await connect(uriToTry);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    if (remoteUri && remoteUri !== localUri) {
      try {
        console.log("Trying local MongoDB fallback at mongodb://127.0.0.1:27017/waleed_project");
        await connect(localUri);
      } catch (fallbackError) {
        console.error("❌ Local MongoDB fallback failed:", fallbackError.message);
        console.log("Starting in-memory MongoDB server as fallback.");
        await connectMemoryDb();
      }
    } else {
      console.log("Starting in-memory MongoDB server as fallback.");
      await connectMemoryDb();
    }
  }
};

module.exports = connectDB;