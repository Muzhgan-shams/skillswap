import { Router } from "express";
import { registerUser } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { registerSchema } from "../validators/user.validator";

const router = Router();

// POST /api/users/register
router.post("/register", validate(registerSchema), registerUser);

export default router;
