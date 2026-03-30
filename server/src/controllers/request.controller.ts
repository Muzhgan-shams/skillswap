import type { Request, Response } from "express";
import prisma from "../lib/prisma";
import type {
  CreateRequestInput,
  UpdateRequestInput,
} from "../validators/request.validator";

export const createRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {};
