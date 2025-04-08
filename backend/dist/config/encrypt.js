"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMessage = exports.encryptMessage = void 0;
const crypto_1 = __importDefault(require("crypto"));
const algorithm = "aes-256-cbc";
const secretKey = "12345678901234567890123456789012"; // 32 bytes (256 bits)
const ivLength = 16;
const encryptMessage = (text) => {
    const iv = crypto_1.default.randomBytes(ivLength);
    const cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};
exports.encryptMessage = encryptMessage;
const decryptMessage = (encrypted) => {
    const [ivHex, encryptedHex] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};
exports.decryptMessage = decryptMessage;
