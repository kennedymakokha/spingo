import { Router } from "express";

import { sendSms } from "../controllers/smsEndpoint";


const router = Router();

router.post("/", sendSms);






export default router;
