import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createListingSchema } from "../validators/listing.validator";
import {
  createListing,
  getAllListings,
  getListingById,
} from "../controllers/listing.controller";
const router = Router();

/* Listing public routes */
// GET All Listings
router.get("/", getAllListings);
// GET Single Listing
router.get("/:id", getListingById);
/* Listing Protected Route - token required */
router.post("/", authenticate, validate(createListingSchema), createListing);

export default router;
