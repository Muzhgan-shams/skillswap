import { Router } from "express";
import { createRequest } from "../controllers/request.controller";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createRequestSchema } from "../validators/request.validator";

const router = Router();

router.post("/", authenticate, validate(createRequestSchema), createRequest);

export default router;
