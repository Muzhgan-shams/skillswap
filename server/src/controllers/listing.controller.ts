import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateListingInput } from "../validators/listing.validator";

// All Listings
export const getAllListings = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// Create Listings
export const createListing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { title, description, category, skillOffered, skillWanted, hours } =
    req.body as CreateListingInput;

  const listing = await prisma.listing.create({
    data: {
      userId: req.userId as number,
      title,
      description,
      category,
      skillOffered,
      skillWanted,
      hours,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      skillOffered: true,
      skillWanted: true,
      hours: true,
      isAvailable: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          username: true,
          city: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "Listing created successfully",
    data: listing,
  });
};
