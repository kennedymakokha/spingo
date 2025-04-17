import { Router } from "express";
import { get_contributions, get_Mpesa_logs, get_wallet, Load_wallet, makePayment, mpesa_callback } from "../controllers/walletControllers";
import { authenticateToken } from "../middleware/authMiddleware";


const router = Router();

router.post("/", authenticateToken, Load_wallet);
router.get("/", authenticateToken, get_wallet);
router.post("/pay", authenticateToken, makePayment);
router.get("/mpesa-logs",authenticateToken, get_Mpesa_logs);
router.post("/mpesa-callback", mpesa_callback);
router.get("/contributions", authenticateToken, get_contributions);



export default router;
