import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateListingInput } from "../validators/listing.validator";
import { REPLCommand } from "node:repl";

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

// Single Listing
export const getListingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = parseInt(req.params.id as string);

  if (isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid listing ID",
    });
    return;
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
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
      updatedAt: true,
      user: {
        select: {
          id: true,
          username: true,
          bio: true,
          city: true,
          avatarUrl: true,
        },
      },
      requests: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });
  if (!listing) {
    res.status(404).json({
      success: false,
      message: "Listing not found",
    });
    return;
  }
  res.status(200).json({
    success: true,
    data: listing,
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

// Update Listing
export const updateListing = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid listing ID",
    });
    return;
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    res.status(404).json({ success: false, message: "Listing not found" });
    return;
  }
  if (listing.userId !== req.userId) {
    res.status(403).json({
      // 403 - Forbidden
      success: false,
      message: "You can only update your own listings",
    });
    return;
  }
  const updated = await prisma.listing.update({
    where: { id },
    data: req.body,
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      skillOffered: true,
      skillWanted: true,
      hours: true,
      isAvailable: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    success: true,
    message: "Listing updated successfully",
    data: updated,
  });
};
