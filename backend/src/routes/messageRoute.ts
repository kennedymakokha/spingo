import { Router } from "express";
import { get_single_conversation } from "../controllers/messageController";


const router = Router();


router.get("/", get_single_conversation);
// router.get("/all_bets", get_all_bets);





export default router;
