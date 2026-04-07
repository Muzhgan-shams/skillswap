import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { CreateMessageInput } from "../validators/message.validator";

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { requestId, receiverId, content } = req.body as CreateMessageInput;
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

  if (swapRequest.status !== "ACCEPTED") {
    res.status(400).json({
      success: false,
      message: "You can only message on accepted requests",
    });
    return;
  }

  const isParticipant =
    swapRequest.requesterId === req.userId ||
    swapRequest.ownerId === req.userId;

  if (!isParticipant) {
    res.status(403).json({
      success: false,
      message: "You are not part of this request",
    });
    return;
  }
  const message = await prisma.message.create({
    data: {
      requestId,
      senderId: req.userId as number,
      receiverId,
      content,
    },
    select: {
      id: true,
      content: true,
      isRead: true,
      createdAt: true,
      sender: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
      receiver: {
        select: {
          id: true,
          username: true,
          avatarUrl: true,
        },
      },
    },
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    data: message,
  });
};
