import { Router } from "express";
import {
  createRequest,
  getMyRequests,
} from "../controllers/request.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createRequestSchema } from "../validators/request.validator";

const router = Router();

router.post("/", authenticate, validate(createRequestSchema), createRequest);
router.get("/", authenticate, getMyRequests);

export default router;
