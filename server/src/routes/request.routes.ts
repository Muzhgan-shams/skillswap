import { Router } from "express";
import {
  createRequest,
  deleteRequest,
  getMyRequests,
  updateRequest,
} from "../controllers/request.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createRequestSchema } from "../validators/request.validator";

const router = Router();

router.post("/", authenticate, validate(createRequestSchema), createRequest);
router.get("/", authenticate, getMyRequests);
router.put("/:id", authenticate, validate(createRequestSchema), updateRequest);
router.delete("/:id", authenticate, deleteRequest);
export default router;
