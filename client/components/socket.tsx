
import io from "socket.io-client";


export const socket = io("http://185.113.249.137:4000", {
    // autoConnect: false,
    // transports: ["websocket", "polling"], // Ensure proper transport
    withCredentials: true, // Allow cross-origin credentials
});