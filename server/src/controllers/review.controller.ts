import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import type { CreateReviewInput } from "../validators/review.validator";
import { catchAsync } from "../utils/catchAsync";

export const createReview = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { requestId, revieweeId, rating, title, description } =
      req.body as CreateReviewInput;

    const swapRequest = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!swapRequest) {
      res.status(404).json({
        success: false,
        message: "Request not found",
      });
      return;
    }

    if (swapRequest.status !== "COMPLETED") {
      res.status(400).json({
        success: false,
        message: "You can only review completed swaps",
      });
      return;
    }

    const isParticipant =
      swapRequest.requesterId === req.userId ||
      swapRequest.ownerId === req.userId;

    if (!isParticipant) {
      res.status(403).json({
        success: false,
        message: "You are not part of this swap",
      });
      return;
    }

    if (revieweeId === req.userId) {
      res.status(400).json({
        success: false,
        message: "You cannot review yourself",
      });
      return;
    }
    // console.log("revieweeId:", revieweeId, typeof revieweeId);
    // console.log("req.userId:", req.userId, typeof req.userId);

    const existingReview = await prisma.review.findFirst({
      where: {
        requestId,
        reviewerId: req.userId as number,
      },
    });

    if (existingReview) {
      res.status(409).json({
        success: false,
        message: "You have already reviewed this swap",
      });
      return;
    }

    const review = await prisma.review.create({
      data: {
        requestId,
        reviewerId: req.userId as number,
        revieweeId,
        rating,
        title,
        description,
      },
      select: {
        id: true,
        rating: true,
        title: true,
        description: true,
        createdAt: true,
        reviewer: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
        reviewee: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  },
);

export const getUserReviews = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.userId as string);

    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: { revieweeId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        rating: true,
        title: true,
        description: true,
        createdAt: true,
        reviewer: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
          },
        },
      },
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });
  },
);
