const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// 🔥 Clear MongoDB Database Script
// Deletes ALL existing data (Users, Cards, Comments, etc.)
// Useful before running initialData.js or resetting the project state.

const MONGO_URI = process.env.MONGO_URI;

const clearDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB.");

    await mongoose.connection.db.dropDatabase();
    console.log("🗑 All collections and data deleted successfully.");

    await mongoose.disconnect();
    console.log("🚪 Disconnected from MongoDB. Database is now clean.");
  } catch (error) {
    console.error("❌ Error clearing database:", error);
    await mongoose.disconnect();
    console.log("🚪 Disconnected from MongoDB after error.");
  }
};

clearDatabase();
