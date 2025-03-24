import { Router } from "express";
import { register, login, logout, refresh, session_Check } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", session_Check);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
