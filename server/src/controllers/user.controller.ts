import { env } from "../config/env";
import type { Request, Response } from "express";
import bcrypt from "bcrypt"; // password hashing
import prisma from "../lib/prisma"; // Prisma client instance
import { LoginInput, RegisterInput } from "../validators/user.validator"; // type for registration input
import jwt, { SignOptions } from "jsonwebtoken";

// User Registration
export const registerUser = async (
  // DB operations take time, so we use async/await
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password, bio, city } = req.body as RegisterInput;

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    res.status(409).json({
      success: false,
      message: "Username or email already taken",
    });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      bio,
      city,
    },
    select: {
      id: true,
      username: true,
      email: true,
      bio: true,
      city: true,
      createdAt: true,
    },
  });

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

// User Login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as LoginInput;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"] },
  );
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    data: {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      city: user.city,
    },
  });
};
