import jwt from "jsonwebtoken";
import { handleError } from "../utils/error.js";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    //? get the token from the browser:
    const token = req.cookies.jwt_token;
    if (!token) {
      return next(handleError(401, "Unauthorized- No token provided!"));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (!decoded) {
        return next(handleError(403, "Unauthorized- Invalid token!"));
      }
      const user = await User.findById(decoded.userId).select("-password");
      if (!user) {
        return next(handleError(404, "Unauthorized- User not found!"));
      }
      //! Send the authenticated user to the request:
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return next(handleError(401, "Unauthorized- Token expired!"));
      }
      throw error;
    }
  } catch (error) {
    console.log("Error verifying token:", error.message);
    next(error);
  }
};

export const isAdminRoute = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return next(handleError(403, "Unauthorized- Not an admin!"));
    }
  } catch (error) {
    console.log("Error checking admin role:", error.message);
    next(error);
  }
};
