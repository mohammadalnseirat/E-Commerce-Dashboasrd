import express from "express";
import {
  signInUser,
  signOutUser,
  signUpUser,
  getProfileUser,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/sign-up", signUpUser);
router.post("/sign-in", signInUser);
router.post("/sign-out", signOutUser);
router.get("/get-profile", protectedRoute, getProfileUser);
export default router;
