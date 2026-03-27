import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createListingSchema,
  updateListingSchema,
} from "../validators/listing.validator";
import {
  createListing,
  deleteListing,
  getAllListings,
  getListingById,
  updateListing,
} from "../controllers/listing.controller";
const router = Router();

/* Listing public routes */
// GET All Listings
router.get("/", getAllListings);
// GET Single Listing
router.get("/:id", getListingById);
/* Listing Protected Route - token required */
router.post("/", authenticate, validate(createListingSchema), createListing);
router.put("/:id", authenticate, validate(updateListingSchema), updateListing);
router.delete("/:id", authenticate, deleteListing);

export default router;

//Route Paramter:(:id) is a route parameter a dynamic value part of URL - api/listings/:id -> req.params.id -  to identify a specific resource - come as string

// Query Parameter: (?city=Kabul) -> req.query.city - querry parameter values that comes after ? express put them in req.query as string
