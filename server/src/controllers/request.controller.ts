import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import type {
  CreateRequestInput,
  UpdateRequestInput,
} from "../validators/request.validator";

export const createRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { listingId, message } = req.body as CreateRequestInput;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    res.status(404).json({
      success: false,
      message: "Listing not found",
    });
    return;
  }

  if (!listing.isAvailable) {
    res.status(400).json({
      success: false,
      message: "This listing is no longer available",
    });
    return;
  }

  if (listing.userId === req.userId) {
    res.status(400).json({
      success: false,
      message: "You cannot request your own listing",
    });
    return;
  }

  const existingRequest = await prisma.request.findFirst({
    where: {
      listingId,
      requesterId: req.userId as number,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    res.status(409).json({
      success: false,
      message: "You already have a pending request for this listing",
    });
    return;
  }

  const request = await prisma.request.create({
    data: {
      listingId,
      requesterId: req.userId as number,
      ownerId: listing.userId,
      message,
    },
    select: {
      id: true,
      status: true,
      message: true,
      createdAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          skillOffered: true,
          skillWanted: true,
        },
      },
      requester: {
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
    message: "Request sent successfully",
    data: request,
  });
};

export const getMyRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { role = "requester" } = req.query as { role?: string };

  const where =
    role === "owner"
      ? { ownerId: req.userId as number }
      : { requesterId: req.userId as number };

  const requests = await prisma.request.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      message: true,
      createdAt: true,
      updatedAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          skillOffered: true,
          skillWanted: true,
        },
      },
      requester: {
        select: {
          id: true,
          username: true,
          city: true,
        },
      },
      owner: {
        select: {
          id: true,
          username: true,
          city: true,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: requests,
  });
};

export const updateRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = parseInt(req.params.id as string);
  const { status } = req.body as UpdateRequestInput;
  if (isNaN(id)) {
    res.status(400).json({
      success: false,
      message: "Invalid request ID",
    });
    return;
  }
  const request = await prisma.request.findUnique({
    where: { id },
  });
  if (!request) {
    res.status(404).json({
      success: false,
      message: "Request not found",
    });
    return;
  }
  if (request.ownerId !== req.userId) {
    res.status(403).json({
      success: false,
      message: "Only the listing owner can update request status",
    });
    return;
  }
  const updated = await prisma.request.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      status: true,
      updatedAt: true,
    },
  });
  res.status(200).json({
    success: true,
    message: `Request ${status.toLowerCase()} successfully`,
    data: updated,
  });
};

export const deleteRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {};
