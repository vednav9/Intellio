import jwt from "jsonwebtoken";
import { sql } from "../config/db.js";

// Generate Access Token (short-lived)
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15m", // 15 minutes
  });
};

// Generate Refresh Token (long-lived)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Store Refresh Token in Database
export const storeRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await sql`
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt})
  `;
};

// Verify Token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Delete Refresh Token (for logout)
export const deleteRefreshToken = async (token) => {
  await sql`
    DELETE FROM refresh_tokens WHERE token = ${token}
  `;
};

// Delete all user tokens (logout from all devices)
export const deleteAllUserTokens = async (userId) => {
  await sql`
    DELETE FROM refresh_tokens WHERE user_id = ${userId}
  `;
};
