import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import connectMongo from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

dotenv.config();

// Get the current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectMongo();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to enable CORS
app.use(cors());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to set response headers for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", (await import("./routes/auth.routes.js")).default);
app.use("/api/menu", (await import("./routes/menu.routes.js")).default);
app.use("/api/events", (await import("./routes/event.routes.js")).default);
app.use("/api/gallery", (await import("./routes/gallery.routes.js")).default);

// Middleware to handle errors
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
