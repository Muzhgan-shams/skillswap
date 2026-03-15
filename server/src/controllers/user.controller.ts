import type { Request, Response } from "express";
import bcrypt from "bcrypt"; // password hashing
import prisma from "../lib/prisma"; // Prisma client instance
import { RegisterInput } from "../validators/user.validator"; // type for registration input
import { success } from "zod";

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
