import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { setupSocket } from './config/socket'
import { connectDB } from "./config/db";
import authRoutes from './routes/authRoutes'
import { authenticateToken } from "./middleware/authMiddleware";
// import { authMiddleware } from './middleware/authMiddleware'
const bodyParser = require("body-parser");

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT || 4000;
connectDB();
const httpServer = createServer(app);
const io: any = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://spingofrontend.vercel.app"],
    // methods: ["GET", "POST"],
    credentials: true, // Allow credentials like cookies
  },
});


app.use("/api/auth", authRoutes);
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



setupSocket(io);
