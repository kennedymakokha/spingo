// components/ChatWindow.tsx
"use client";
import { useEffect, useState, useRef } from "react";
import { socket } from "@/components/socket";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChatMessage, ChatWindowProps, Message } from "@/types/chat";
import { UserData } from "@/types/transactions";
import { useRouter } from "next/navigation";
import { fetchData } from "@/lib/utils";


const ChatWindow = ({ username, chatwith, onClose, fetchConversationHistory, toId, messages, setMessages }: ChatWindowProps) => {


    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<UserData>();
    const [typingUser, setTypingUser] = useState<string | null | any>(null);
    let typingTimeout: ReturnType<typeof setTimeout> | null = null;

    const router = useRouter();
    useEffect(() => {

        socket.on("message", (msg: ChatMessage) => {
            console.log("Message", msg)
            setMessages((prev: any) => [...prev, msg]);
        });

        return () => {
            socket.off("message");
        };
    }, [username]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    useEffect(() => {

        socket.on("typing", (user: string | any) => setTypingUser(user));
        socket.on("stopTyping", () => setTypingUser(null));

        return () => {
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [])

    useEffect(() => {
        fetchData({ setUser })
    }, [])

    const sendMessage = async () => {
        if (!input.trim()) return;

        const msg: ChatMessage = {
            socketId: socket.id,
            userId: user?._id,
            fromId: user?._id,
            toId: toId,
            username: user?.username,
            message: input,
            from: user?.username
        };

        setMessages((prev: any) => [...prev, msg]);
        socket.emit("message", msg);
        await fetchConversationHistory(toId)
        setInput("");
    };
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);

        socket.emit("typing", username);

        if (typingTimeout) clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            socket.emit("stopTyping");
        }, 1000);
    };

    useEffect(() => {
        socket.on("user-left", (username: string) => {
            const sysMessage: Message = {
                from: "System",
                text: `${username} left the chat`,
                type: "system",
                timestamp: new Date().toISOString(),
            };
            setMessages((prev: any) => [...prev, sysMessage]);

        });

        return () => {
            socket.off("user-left");
        };
    }, []);
    let currentUser = user?.username
    // useEffect(() => {
    //     socket.on("user-joined", (username: string) => {
    //         alert(username)
    //         const sysMessage: Message = {
    //             from: "System",
    //             text: `${username} joined the chat`,
    //             type: "system",
    //             timestamp: new Date().toISOString(),
    //         };
    //         setMessages((prev: any) => [...prev, sysMessage]);
    //         // playSound("join.mp3");
    //     });

    //     socket.on("user-left", (username: string) => {
    //         const sysMessage: Message = {
    //             from: "System",
    //             text: `${username} left the chat`,
    //             type: "system",
    //             timestamp: new Date().toISOString(),
    //         };
    //         setMessages((prev: any) => [...prev, sysMessage]);
    //         // playSound("leave.mp3");
    //     });

    // }, [])
    return (
        <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed right-4 bottom-4 w-96 h-[500px] bg-white rounded-2xl shadow-xl flex flex-col border border-[#22b14c] z-50"
        >
            {/* Header */}
            <div className="flex justify-between items-center bg-[#22b14c] text-white px-4 py-3 rounded-t-2xl">
                <h3 className="font-bold italic">{chatwith}</h3>
                <svg xmlns="http://www.w3.org/2000/svg"  onClick={onClose} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
                {messages.map((msg: any, index) => {
                    const isOwn = msg.sender === user?._id;
                    return (
                        <>
                            {msg.type === "system" ?
                                <div
                                    key={index}
                                    className="text-center text-sm text-gray-400 italic my-2"
                                >
                                    {msg.message}
                                </div> :

                                <motion.div
                                    key={index}
                                    className={`flex items-end ${isOwn ? "justify-end" : "justify-start"}`}

                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >

                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-2xl ${isOwn ? "bg-[#22b14c] text-white rounded-br-none" : "bg-gray-200 text-black rounded-bl-none"
                                            }`}
                                    >
                                        <p className="text-sm font-semibold">{!isOwn && msg.username}</p>
                                        <p>{msg.message}</p>
                                    </div>

                                </motion.div>
                            }
                        </>

                    );
                })}
                <div ref={chatEndRef}></div>
            </div >

            {/* Input */}
            {
                typingUser && typingUser !== username && (
                    <p className="text-xs text-gray-500 pb-1 pl-4 animate-pulse">{typingUser} is typing...</p>
                )
            }
            <div className="flex px-4 py-3 border-t border-gray-200">
                <input
                    className="flex-1 border  border-green-300 text-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none"
                    placeholder="Type a message..."
                    value={input}
                    onChange={handleTyping}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-[#ed1c24] hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm"
                >
                    Send
                </button>
            </div>
        </motion.div>
    );
};

export default ChatWindow;
