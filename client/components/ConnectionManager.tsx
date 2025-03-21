import React from 'react';
import io from "socket.io-client";

const socket = io("http://localhost:4000", {
    transports: ["websocket", "polling"], // Ensure proper transport
    withCredentials: true, // Allow cross-origin credentials
});
export function ConnectionManager() {
    function connect() {
        socket.connect();
    }

    function disconnect() {
        socket.disconnect();
    }

    return (
        <>
            <button onClick={connect}>Connect</button>
            <button onClick={disconnect}>Disconnect</button>
        </>
    );
}