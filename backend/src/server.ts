import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { setupSocket } from './config/socket'
import { connectDB } from "./config/db";
import authRoutes from './routes/authRoutes'
import { authenticateToken } from "./middleware/authMiddleware";
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
    origin: ["http://localhost:3000"],
    // methods: ["GET", "POST"],
    // credentials: true, // Allow credentials like cookies
  },
});

// io.on("connection", (socket: any) => {
//   console.log(`User connected on server : ${socket.id}`);
//   // socket.on("startGame", () => {
//   //   let countdown = 5;
//   //   io.emit("timerStart", { duration: countdown });
//   //   console.log("first")

//   //   const timerInterval = setInterval(() => {
//   //     countdown--;
//   //     if (countdown > 0) {
//   //       io.emit("timerUpdate", { duration: countdown });
//   //     } else {
//   //       clearInterval(timerInterval);
//   //       io.emit("enablePlay");
//   //     }
//   //   }, 1000);
//   // });
//   // socket.on("start", ({ prediction }: any) => {
//   //   let countdown = 5;
//   //   io.emit("timerStart", { duration: countdown });
//   //   console.log("first")
//   // });
//   // socket.on("flipCoin", ({ prediction }: any) => {
//   //   const flipResult = Math.random() > 0.5 ? "heads" : "tails";
//   //   io.emit("flipResult", flipResult);
//   // });

//   socket.on("disconnect", () => {
//     console.log(`User disconnected: ${socket.id}`);
//   });
// });
app.use("/api/auth", authRoutes);
app.get("/api/protected", authenticateToken, (req: any, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
app.get("/", (req, res) => {
  res.send("WebSocket Server is running!");
});


httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});



setupSocket(io);
