
import { Socket } from "socket.io";
import { MakeActivationCode } from "../utils/generate_activation";
import { ChatMessage, Predictor } from "../types";
import Message from "../models/messages";
import { encryptMessage } from "./encrypt";
import { get_wallet } from "../controllers/walletControllers";
import Wallet from "../models/wallet";

let io: any = null;
let users: { [key: string]: string } = {};
export const setupSocket = (socketInstance: any) => {
    io = socketInstance;
    let predictors: any = []
    let flipResult
    let duration = 15;
    var time: any;

    ////////////////////////////////////////
    function runGame() {
        time = duration;

        var timerInterval = setInterval(function () {

            io.emit('timerUpdate', time);

            if (--time < 0) {
                ///// implement game logic

                // var bet = Math.floor(Math.random() * 2) ? "heads" : "tails";

                // io.emit('flipCoin', bet);   //mk



                clearInterval(timerInterval);

                setTimeout(function () {
                    let flipResult
                    let outcome = predictors.reduce((acc: any, item: any) => {
                        acc[item.bet] = (acc[item.bet] || 0) + 1;
                        return acc;
                    }, { heads: 0, tails: 0 });
                    const result = outcome.heads > outcome.tails ? "heads" : outcome.tails > outcome.heads ? "tails" : "equal";


                    if (result === "equal" || predictors.length === 1) {
                        flipResult = Math.random() > 0.5 ? "heads" : "tails";
                    } else {
                        flipResult = result === "tails" ? "heads" : result === "heads" ? "tails" : ""
                    }
                    io.emit('flipCoin', flipResult);
                    console.log(predictors)
                    console.log(flipResult, result)
                    // console.log(bet, "the bet is")
                    runGame();
                }, 7 * 1000);

            }
            // console.log(time);
            // console.log(predictors)

        }, 1000);

    }

    runGame();


    io.on("connection", (socket: any) => {
        console.log("SOCKET CONNECTION MADE:", socket.id);
        // io.emit('status', time);

        socket.on("place-bet", (data: any) => {
            let newItem = { socketId: socket.id, bet: data.bet, userId: data.uuid }
            const existing = predictors.find((item: Predictor) => item.socketId === socket.id);

            if (existing) {
                existing.bet = data.bet; // 🔁 Update the bet
            } else {
                predictors.push(newItem); // ➕ Add new entry
            }

        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

    });





    // io.on("connection", (socket: Socket) => {
    //     console.log("User connected :", socket.id);
    //     socket.on("flipCoin", ({ prediction }: any) => {

    //         let flipResult
    //         let outcome = predictors.reduce((acc: any, item: any) => {
    //             acc[item.bet] = (acc[item.bet] || 0) + 1;
    //             return acc;
    //         }, { heads: 0, tails: 0 });
    //         const result = outcome.heads > outcome.tails ? "heads" : outcome.tails > outcome.heads ? "tails" : "equal";

    //         console.log(result)
    //         if (result === "equal" || predictors.length === 1) {
    //             flipResult = Math.random() > 0.5 ? "heads" : "tails";
    //         } else {
    //             flipResult = result === "tails" ? "heads" : result === "heads" ? "tails" : ""
    //         }
    //         console.log(predictors)
    //         io.emit("flipResult", { flipResult, spin_id: MakeActivationCode(8) });
    //         predictors = []
    //         socket.emit("startGame")
    //     });
    //     socket.on("postPredict", prediction => {
    //         let newItem = { socketId: socket.id, bet: prediction.bet, userId: prediction.uuid }
    //         if (!predictors.some((item: any) => item.socketId === socket.id)) {
    //             predictors.push(newItem);
    //         }
    //         // const flipResult = Math.random() > 0.5 ? "heads" : "tails";
    //         // io.emit("flipResult", flipResult);
    //     });

    //     socket.on("startGame", () => {
    //         let countdown = 40;
    //         io.emit("timerStart", countdown);
    //         const timerInterval = setInterval(() => {
    //             countdown--;
    //             if (countdown > 0) {
    //                 io.emit("timerUpdate", countdown);
    //             } else {
    //                 clearInterval(timerInterval);
    //                 io.emit("enablePlay");
    //             }
    //         }, 1000);
    //     });
    //     socket.on("restartBrowser", (min) => {
    //         let countdown = min ? min : 10;
    //         io.emit("browserStart", countdown);
    //         const timerInterval = setInterval(() => {
    //             countdown--;
    //             if (countdown > 0) {
    //                 io.emit("browsertimerUpdate", countdown);
    //             } else {
    //                 clearInterval(timerInterval);
    //                 io.emit("restartNow");
    //             }
    //         }, 1000);
    //     });

    //     socket.on("join", (username: string) => {
    //         users[username] = socket.id; // Store username and socket ID
    //         console.log(`${username} joined the chat`);
    //         // Broadcast to other users that a user has joined
    //         socket.broadcast.emit("user-joined", username);
    //     });

    //     socket.on("message", async (msg: ChatMessage) => {
    //         // console.log("Message received:", msg);
    //         const encrypted = encryptMessage(msg.message);
    //         const message = new Message({
    //             socketId: msg.socketId,
    //             sender: msg.userId,
    //             receiver: msg.toId,
    //             message: msg.message,
    //             type: "user", // you can change based on your logic
    //         });

    //         await message.save();
    //         socket.broadcast.emit("message", msg);
    //     });
    //     socket.on("update-wallet", async (id: string) => {
    //         let wallet = await Wallet.findOne({ user_id: id })

    //         socket.broadcast.emit("update-wallet", wallet);
    //     });
    //     socket.on("typing", (username: string) => {
    //         socket.broadcast.emit("typing", username); // broadcast to everyone except sender
    //     });

    //     // When they stop typing
    //     socket.on("stopTyping", () => {
    //         socket.broadcast.emit("stopTyping");
    //     });

    //     socket.on("disconnect", () => {
    //         // Find the user who disconnected (You can map users to socket ids)
    //         const username = Object.keys(users).find(user => users[user] === socket.id);

    //         if (username) {
    //             console.log(`${username} disconnected`);
    //             // Remove the user from the list
    //             delete users[username];

    //             // Notify others that the user has left the chat
    //             socket.broadcast.emit("user-left", username); // Emit to everyone except the leaving user
    //         }
    //     });
    // });
};
export const getSocketIo = () => io;
