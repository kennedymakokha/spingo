
import io from "socket.io-client";


export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    transports: ["websocket", "polling"], // Ensure proper transport
    withCredentials: true, // Allow cross-origin credentials
});