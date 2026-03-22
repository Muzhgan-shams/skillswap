import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createListingSchema } from "../validators/listing.validator";
const router = Router();
/* Listing Protected Route - token required */
router.post("/", authenticate, validate(createListingSchema));

export default router;
