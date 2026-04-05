import { Router } from "express";
import {
  getMe,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/user.controller";
import { validate } from "../middleware/validate";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/user.validator";
import { authenticate } from "../middleware/auth";

const router = Router();
/* Public Routes */
// POST /api/users/register
router.post("/register", validate(registerSchema), registerUser);

// POST /api/users/login
router.post("/login", validate(loginSchema), loginUser);

/* Private Routes - token required */
router.get("/me", authenticate, getMe);
router.put("/me", authenticate, validate(updateProfileSchema), updateProfile);

export default router;
