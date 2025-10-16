import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Token error" });

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: "Malformed token" });

  try {
    const secret = process.env.JWT_SECRET || "change_this_secret";
    const decoded = jwt.verify(token, secret) as any;
    req.userId = decoded.id;
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
