import { Router } from "express";
import { loginUser, registerUser } from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema } from "../validators/user.validator";

const router = Router();

// POST /api/users/register
router.post("/register", validate(registerSchema), registerUser);

// POST /api/users/login
router.post("/login", validate(loginSchema), loginUser);
export default router;
