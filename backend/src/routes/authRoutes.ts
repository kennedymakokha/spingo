import { Router } from "express";
import { register, login, logout, refresh, session_Check, updatePassword, activateuser, requestToken, verifyuser, get_Users, registerAdmin, admin_login, get_Admins } from "../controllers/authController";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/", session_Check);
router.post("/refresh", refresh);
router.post("/reset-password", updatePassword);
router.post("/activate-user", activateuser);
router.post("/verify-otp", verifyuser);
router.post("/request-otp", requestToken);
router.post("/logout", logout);

// admin
router.post("/admin-register", registerAdmin);
router.post("/admin-login", admin_login);
router.get("/admin/users", get_Users);
router.get("/admin/users/admins", get_Admins);


export default router;
