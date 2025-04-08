"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const socket_1 = require("./config/socket");
const db_1 = require("./config/db");
const walletRoutes_1 = __importDefault(require("./routes/walletRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const predictRoutes_1 = __importDefault(require("./routes/predictRoutes"));
const messageRoute_1 = __importDefault(require("./routes/messageRoute"));
const smsRoute_1 = __importDefault(require("./routes/smsRoute"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = require("./models/user");
const cors_1 = __importDefault(require("cors"));
// dotenv.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ credentials: true, origin: ["http://localhost:3000", "https://marapesa.com", "https://spingofrontend.vercel.app", "https://api.marapesa.com"] }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const PORT = process.env.PORT || 4000;
(0, db_1.connectDB)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "https://spingofrontend.vercel.app", "https://marapesa.com", "http://185.113.249.137:3000", "https://api.marapesa.com"],
        methods: ["GET", "POST"],
        credentials: true, // Allow credentials like cookies
        allowedHeaders: "Content-Type,Authorization", // Allow headers
    },
});
app.use("/api/auth", authRoutes_1.default);
app.use("/api/wallet", walletRoutes_1.default);
app.use("/api/predictions", authMiddleware_1.authenticateToken, predictRoutes_1.default);
app.use("/api/messages", authMiddleware_1.authenticateToken, messageRoute_1.default);
app.use("/api/sms", smsRoute_1.default);
app.get("/api/authenticated", authMiddleware_1.authenticateToken, async (req, res) => {
    let authuser = await user_1.User.findById(req.user.userId);
    res.json(authuser);
});
app.get("/api/protected", authMiddleware_1.authenticateToken, (req, res) => {
    res.json({ message: "This is a protected route", user: req.user });
});
app.get("/", (req, res) => {
    res.send("WebSocket Server is running!");
    return;
});
httpServer.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
console.log("PORT:", process.env.PORT);
(0, socket_1.setupSocket)(io);
