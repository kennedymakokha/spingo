"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.JWT_SECRET || "default_secret";
// Hash password
const hashPassword = async (password) => {
    return await bcryptjs_1.default.hash(password, 10);
};
exports.hashPassword = hashPassword;
// Compare password with stored hash
const verifyPassword = async (password, hash) => {
    return await bcryptjs_1.default.compare(password, hash);
};
exports.verifyPassword = verifyPassword;
// Generate JWT token
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
};
exports.generateToken = generateToken;
