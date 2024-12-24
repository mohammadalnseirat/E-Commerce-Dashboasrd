import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "15d", // expires in 15 days
  });
  res.cookie("jwt_token", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
