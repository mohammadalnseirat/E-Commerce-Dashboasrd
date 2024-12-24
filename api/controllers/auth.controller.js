import User from "../models/user.model.js";
import { handleError } from "../utils/error.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

//! 1-Sign Up User:
export const signUpUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (
      !email ||
      !password ||
      !name ||
      email === "" ||
      name === "" ||
      password === ""
    ) {
      return next(handleError(400, "All fields required!"));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(handleError(400, "Email already exists!"));
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    if (!passwordRegex.test(password)) {
      return next(
        handleError(
          400,
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character!"
        )
      );
    }
    // ? create new user:
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      //* Create token:
      generateTokenAndSetCookie(user._id, res);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      next(handleError(401, "Invalid User Data!"));
    }
  } catch (error) {
    console.log("Error signing up user:", error.message);
    next(error);
  }
};

//! 2-Login User:
export const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password || email === "" || password === "") {
      return next(handleError(400, "All fields required!"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "Invalid Credentials!"));
    }
    if (user && (await user.matchPassword(password))) {
      //? Create token:
      generateTokenAndSetCookie(user._id, res);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      next(handleError(401, "Invalid Credentials!"));
    }
  } catch (error) {
    console.log("Error signing in user:", error.message);
    next(error);
  }
};

//! 3-Sign Out User:
export const signOutUser = async (req, res, next) => {
  try {
    res.clearCookie("jwt-token");
    res.status(200).json({ message: "User signed out successfully!" });
  } catch (error) {
    console.log("Error signing out user:", error.message);
    next(error);
  }
};

//! 4-Get Profile:
export const getProfileUser = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error getting profile:", error.message);
    next(error);
  }
};
