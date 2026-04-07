import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createMessageSchema } from "../validators/message.validator";
import { sendMessage } from "../controllers/message.controller";

const router = Router();

router.post("/", authenticate, validate(createMessageSchema), sendMessage);
export default router;
