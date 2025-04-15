import dotenv from "dotenv";
dotenv.config();
import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

import { setupSocket } from './config/socket'
import { connectDB } from "./config/db";
import walletRoutes from './routes/walletRoutes'
import authRoutes from './routes/authRoutes'
import predictRoutes from './routes/predictRoutes'
import MessagesRoute from './routes/messageRoute'

import SmsRoute from './routes/smsRoute'
import { authenticateToken } from "./middleware/authMiddleware";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { User } from "./models/user";
import cors from 'cors'
// dotenv.config();
const app = express();

app.use(cors({ credentials: true, origin: ["http://localhost:3000", "https://marapesa.com", "https://spingofrontend.vercel.app", "https://api.marapesa.com"] }))
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;
connectDB();

const httpServer = createServer(app);
const io: any = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://spingofrontend.vercel.app", "https://marapesa.com", "http://185.113.249.137:3000", "https://api.marapesa.com"],
    methods: ["GET", "POST"],
    credentials: true, // Allow credentials like cookies
    allowedHeaders: "Content-Type,Authorization", // Allow headers
  },
});
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/predictions", authenticateToken, predictRoutes);
app.use("/api/messages", authenticateToken, MessagesRoute);
app.use("/api/sms", SmsRoute);
app.get("/api/authenticated", authenticateToken, async (req: any, res) => {
  let authuser = await User.findById(req.user.userId)
  res.json(authuser);
});
app.get("/api/protected", authenticateToken, (req: any, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
app.get("/", (req, res) => {
  res.send("WebSocket Server is running!");
  return
});


httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

console.log("PORT:", process.env.PORT);

setupSocket(io);
