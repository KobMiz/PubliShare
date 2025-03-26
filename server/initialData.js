const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/userModel");
const Card = require("./models/cardModel");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// 🌱 Initial Database Seeding
// Creates two users: Regular and Admin, and a few example posts.
// Regular User Credentials:
// Email: defaultuser@example.com
// Password: Test1234
//
// Admin User Credentials:
// Email: adminuser@example.com
// Password: Test1234

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Connected to MongoDB: ${MONGO_URI}`);

    await User.deleteMany({});
    await Card.deleteMany({});
    console.log("🗑 Old data cleared.");

    const hashedPassword = await bcrypt.hash("Test1234", 10);

    const users = [
      {
        firstName: "Default",
        lastName: "User",
        nickname: "DefaultNick",
        email: "defaultuser@example.com",
        password: hashedPassword,
        phone: "1234567898",
        country: "Country1",
        birthdate: "1990-01-01",
      },
      {
        firstName: "Admin",
        lastName: "User",
        nickname: "AdminMaster",
        email: "adminuser@example.com",
        password: hashedPassword,
        phone: "5555555555",
        country: "Country3",
        birthdate: "1985-06-15",
        isAdmin: true,
      },
    ];

    console.log("🛠 Creating users...");
    const createdUsers = await User.insertMany(users);
    console.log("✅ Users created successfully.");

    const defaultUser = await User.findOne({
      email: "defaultuser@example.com",
    });
    if (!defaultUser) {
      console.error("❌ Default user not found. Skipping card creation.");
      await mongoose.disconnect();
      return;
    }

    console.log("🛠 Creating posts...");
    const cards = [
      {
        user_id: defaultUser._id,
        text: "Hello, world! This is my first post.",
        image: null,
        link: null,
        likes: [],
      },
      {
        user_id: defaultUser._id,
        text: "Check out this amazing picture!",
        image: "https://example.com/image.jpg",
        link: null,
        likes: [],
      },
      {
        user_id: defaultUser._id,
        text: "Watch this great video!",
        image: null,
        link: "https://youtube.com/watch?v=xyz123",
        likes: [],
      },
    ];

    const createdCards = await Card.insertMany(cards);
    console.log("✅ Posts created successfully:", createdCards);

    console.log(
      "🔐 Default User: defaultuser@example.com | Password: Test1234"
    );
    console.log("🔑 Admin User: adminuser@example.com | Password: Test1234");

    console.log("🎉 Database seeding completed.");
    await mongoose.disconnect();
    console.log("🚪 Disconnected from MongoDB.");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    await mongoose.disconnect();
    console.log("🚪 Disconnected from MongoDB after error.");
  }
};

seedData();
