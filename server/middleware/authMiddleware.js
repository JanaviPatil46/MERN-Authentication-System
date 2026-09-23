import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifies the JWT stored in the httpOnly cookie and attaches the user to req
export async function protect(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ message: "Not signed in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
    req.user = user;
    req.tokenExpiresAt = decoded.exp * 1000; // ms timestamp
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Sign in again." });
  }
}
