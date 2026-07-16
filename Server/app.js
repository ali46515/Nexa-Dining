import express from "express";
import dotenv from "dotenv";
import connectMongo from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

dotenv.config();

// Connect to MongoDB
connectMongo();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// Middleware to set response headers for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});


// Routes
app.use("/api/auth", (await import("./routes/auth.routes.js")).default);

// Middleware to handle errors
app.use(errorHandler);


app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
