"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const predictControllers_1 = require("../controllers/predictControllers");
const router = (0, express_1.Router)();
router.post("/", predictControllers_1.place_bet);
router.get("/", predictControllers_1.get_bets);
router.get("/all_bets", predictControllers_1.get_all_bets);
exports.default = router;
