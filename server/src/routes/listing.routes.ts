import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createListingSchema } from "../validators/listing.validator";
import { createListing } from "../controllers/listing.controller";
const router = Router();
/* Listing Protected Route - token required */
router.post("/", authenticate, validate(createListingSchema), createListing);

export default router;
