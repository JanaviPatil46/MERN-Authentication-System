import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { SESSION_DURATIONS, resolveDuration } from "../config/session.js";

const isProd = () => process.env.NODE_ENV === "production";

const cookieOptions = () => ({
  httpOnly: true, // not readable from JavaScript -> protects against XSS token theft
  secure: isProd(),
  sameSite: isProd() ? "none" : "lax",
});

function sendToken(user, statusCode, res, requestedDuration) {
  const duration = resolveDuration(requestedDuration);
  const ms = SESSION_DURATIONS[duration];

  // Token and cookie expire at the same moment
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: Math.floor(ms / 1000),
  });

  res
    .status(statusCode)
    .cookie("token", token, { ...cookieOptions(), maxAge: ms })
    .json({
      user: { id: user._id, name: user.name, email: user.email },
      expiresAt: Date.now() + ms,
    });
}

// POST /api/auth/signup
export async function signup(req, res) {
  try {
    const { name, email, password, duration } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    sendToken(user, 201, res, duration);
  } catch (err) {
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)[0].message;
      return res.status(400).json({ message });
    }
    console.error(err);
    res.status(500).json({ message: "Could not create account" });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password, duration } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same message for both cases so attackers can't discover which emails exist
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Email or password is incorrect" });
    }

    sendToken(user, 200, res, duration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not sign in" });
  }
}

// POST /api/auth/logout
export function logout(req, res) {
  res.clearCookie("token", cookieOptions()).json({ message: "Signed out" });
}

// GET /api/auth/me  (protected)
export function getMe(req, res) {
  const { _id, name, email, createdAt } = req.user;
  res.json({
    user: { id: _id, name, email, createdAt },
    expiresAt: req.tokenExpiresAt,
  });
}
