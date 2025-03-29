import { Router } from "express";
import { get_all_bets, get_bets, place_bet } from "../controllers/predictControllers";


const router = Router();

router.post("/", place_bet);
router.get("/", get_bets);
router.get("/all_bets", get_all_bets);





export default router;
