"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const smsEndpoint_1 = require("../controllers/smsEndpoint");
const router = (0, express_1.Router)();
router.post("/", smsEndpoint_1.sendSms);
exports.default = router;
