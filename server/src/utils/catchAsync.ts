import type { Request, Response, NextFunction } from "express";

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

//higher order function that takes a controller function as input and returns a new function that wraps it
export const catchAsync = (fn: AsyncController): AsyncController => {
  // shape of an async Express controller function
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return fn(req, res, next).catch(next);
  };
};
