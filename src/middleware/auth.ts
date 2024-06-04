// middleware/auth.js
import { NextApiRequest, NextApiResponse } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config/config";

export const checkAuth = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => void
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Authentication token required" });
    return;
  }

  try {
    const user = jwt.verify(token, config.jwtSecret) as JwtPayload;
    req.headers["email"] = user.email;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
