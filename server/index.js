const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const cardRoutes = require("./routes/cardRoutes");
const swaggerUi = require("swagger-ui-express");
const contactRoutes = require("./routes/contactRoutes");
const searchRoutes = require("./routes/searchRoutes");
const swaggerSpec = require("./swaggerConfig");
const path = require("path");
const rateLimit = require("express-rate-limit"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

const MONGO_URI =
  NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI;

console.log(`Running in ${NODE_ENV} mode`);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      `Connected to MongoDB: ${
        MONGO_URI.includes("mongodb+srv") ? "Atlas" : "Local"
      }`
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

mongoose.connection.on("connected", () =>
  console.log("Mongoose connected to DB")
);
mongoose.connection.on("error", (err) =>
  console.error(`Mongoose connection error: ${err}`)
);
mongoose.connection.on("disconnected", () =>
  console.log("Mongoose disconnected")
);

app.use(morgan(NODE_ENV === "development" ? "dev" : "tiny"));


const allowedOrigins =
  NODE_ENV === "development"
    ? ["http://localhost:5173"]
    : ["https://your-production-domain.com"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

if (NODE_ENV === "development") {
  app.use(cors());
} else {
  app.use(cors(corsOptions));
}

app.use(express.json());

const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, 
  max: 1000, // הגבלה
  message: "חרגת ממספר הבקשות המותר ליום, אנא נסה שוב מאוחר יותר.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use("/contact", contactRoutes);
app.use("/users", userRoutes);
app.use("/cards", cardRoutes);
app.use("/search", searchRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));


app.get("/", (req, res) => res.send("Server is running!"));

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
