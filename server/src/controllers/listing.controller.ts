import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateListingInput } from "../validators/listing.validator";

// All Listings
export const getAllListings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const {
    category,
    city,
    skill,
    page = "1",
    limit = "10",
  } = req.query as {
    category?: string;
    city?: string;
    skill?: string;
    page?: string;
    limit?: string;
  };
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;
  const where = {
    isAvailable: true,
    ...(category && { category }),
    ...(city && { user: { city } }),
    ...(skill && {
      OR: [
        { skillOffered: { contains: skill, mode: "insensitive" as const } },
        { skillWanted: { contains: skill, mode: "insensitive" as const } },
      ],
    }),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: limitNumber,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
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
            avatarUrl: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  res.status(200).json({
    success: true,
    data: listings,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  });
};

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
