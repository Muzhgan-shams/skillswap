import { Router } from "express";
import { createReview, getUserReviews } from "../controllers/review.controller";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/auth";
import { createReviewSchema } from "../validators/review.validator";

const router = Router();

router.post("/", authenticate, validate(createReviewSchema), createReview);
router.get("/:userId", getUserReviews);

export default router;
