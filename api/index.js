import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
//? Routes:
app.use("/api/v1/auth", authRoutes);
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
