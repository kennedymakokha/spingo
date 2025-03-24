import { Router } from "express";
import { get_contributions, get_wallet, Load_wallet } from "../controllers/walletControllers";


const router = Router();

router.post("/", Load_wallet);
router.get("/", get_wallet);
router.get("/contributions", get_contributions);



export default router;
