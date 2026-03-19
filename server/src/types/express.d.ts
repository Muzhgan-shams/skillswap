import "express";

declare module "express" {
  // module augmentation to add custom fields to the Express Request type
  interface Request {
    // to add userId and userEmail to the Express Request type field
    userId?: number;
    userEmail?: string;
  }
}
