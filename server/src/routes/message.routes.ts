import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createMessageSchema } from "../validators/message.validator";
import {
  getMessages,
  markAsRead,
  sendMessage,
} from "../controllers/message.controller";

const router = Router();

router.post("/", authenticate, validate(createMessageSchema), sendMessage);
router.get("/:requestId", authenticate, getMessages);
router.put("/:id/read", authenticate, markAsRead);
export default router;
