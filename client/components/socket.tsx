
import io from "socket.io-client";


export const socket = io(`https://api.marapesa.com`, {
    transports: ["websocket", "polling"], // Ensure proper transport
    withCredentials: true, // Allow cross-origin credentials
});