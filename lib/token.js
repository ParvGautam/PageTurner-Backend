import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // For cross-domain cookies to work in modern browsers:
  // 1. secure must be true when sameSite is None
  // 2. domain should not be set to allow the browser to use the current domain
  // 3. credentials must be included in the request
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
<<<<<<< HEAD
    sameSite: "None",
    secure: true,
    path: "/",
=======
    sameSite: "none",
    secure: process.env.NODE_ENV !== "development",
    path:"/",
>>>>>>> 8f699fc80df05902fd4294acfe5d6b27265c23d8
  });

  return token;
};
