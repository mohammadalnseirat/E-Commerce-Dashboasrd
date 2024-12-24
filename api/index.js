import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

//? listen to the port:
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

//? Middleware for error handling:
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
