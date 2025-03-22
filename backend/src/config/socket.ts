
import { Socket } from "socket.io";

let io: any = null;

export const setupSocket = (socketInstance: any) => {
    io = socketInstance;
    let predictors: any = []
    io.on("connection", (socket: Socket) => {
        console.log("User connected :", socket.id);
        socket.on("flipCoin", ({ prediction }: any) => {
            let flipResult

            let outcome = predictors.reduce((acc: any, item: any) => {
                acc[item.bet] = (acc[item.bet] || 0) + 1;
                return acc;
            }, { heads: 0, tails: 0 });
            const result = outcome.heads > outcome.tails ? "heads" : outcome.tails > outcome.heads ? "tails" : "equal";
            console.log(result)
            if (result === "equal" || predictors.length === 1) {
                flipResult = Math.random() > 0.5 ? "heads" : "tails";
            } else {
                flipResult = result === "tails" ? "heads" : result === "heads" ? "tails" : ""
            }
            io.emit("flipResult", flipResult);
            predictors = []
            socket.emit("startGame")
        });
        socket.on("postPredict", prediction => {
            let newItem = { socketId: socket.id, bet: prediction.bet, userId: prediction.uuid }

            if (!predictors.some((item: any) => item.socketId === socket.id)) {
                predictors.push(newItem);
            }
            // const flipResult = Math.random() > 0.5 ? "heads" : "tails";
            // io.emit("flipResult", flipResult);
        });

        socket.on("startGame", () => {
            let countdown = 10;
            io.emit("timerStart", countdown);
            const timerInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    io.emit("timerUpdate", countdown);
                } else {
                    clearInterval(timerInterval);
                    io.emit("enablePlay");
                }
            }, 1000);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
export const getSocketIo = () => io;
