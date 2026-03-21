import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  userId: number;
  email: string;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Access denied. No token provided.",
    });
    return;
  }
  const tokem = authHeader.split(" ")[1]; //  splits 'Bearer eyJhbGci...' by the space and takes the second part — just the token itself.
  const decoded = jwt.verify(tokem, env.JWT_SECRET) as JwtPayload;
  req.userId = decoded.userId; // attaches userId to the request, every controller after this middleware can read req.userId
  req.userEmail = decoded.email;
  next();
};
