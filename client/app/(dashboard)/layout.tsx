"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { deleteCookie, setCookie } from 'cookies-next';
import { socket } from "@/components/socket";
import { LogOutUser } from "@/actions/authActions";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { UserData } from "@/types/transactions";
import ChatWindow from "@/components/chatwindow";
import { Message } from "@/types/chat";


const menuItems = [
  { name: "Dashboard", icon: "m2.25 12 8.954-8.955...", path: "/" },
  { name: "Analytics", icon: "M2.25 18 9 11.25...", path: "/analytics" },
  { name: "Wallet", icon: "M21 12a2.25 2.25...", path: "/wallet" },
];

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("Dashboard");
  const [user, setUser] = useState<UserData>();
  const [data, setData] = useState<any>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const router = useRouter();

  const [chatUsers, setChatUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState<string[] | any>([
  ]);
  const fetchUsers = async () => {
    try {

      const results = await apiClient().get<any>(`auth/admin/users?page=${1}&limit=${100}&sendId=true`);
      setChatUsers(results.data.users)

    } catch (err) {
      console.log(err)
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClient().get(`authenticated`);
      const result = await apiClient().get<any>(`wallet`);
      setData(result?.data);
      setUser(response.data);
    } catch (err) {
      router.push('/login');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    await LogOutUser();
    localStorage.removeItem("accessToken");
    setCookie('sessionToken', '', { expires: new Date(0) });
    router.push("/login");
    socket.on('disconnect', () => console.log('Disconnected from socket'));
  };
  const openChat = () => {
    setChatOpen(true);
    setHasUnread(false); // clear unread
  };

  const closeChat = () => setChatOpen(false);
  const fetchConversationHistory = async (user1: string) => {
    try {

      const response = await apiClient().get<any>(`messages?user=${user1}`);

      setMessages(response?.data); // Set the messages in your state
    } catch (err) {
      console.error("Error fetching chat history:", err);
    }
  };
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  const showDesktopNotification = (message: string, from: string) => {
    if (Notification.permission === "granted") {
      new Notification("💬 New message", {
        body: `${from}: ${message}`,
        icon: "/chat-icon.png", // Optional: path to your icon in public/
      });
    }
  };
  const playNotificationSound = () => {
    const audio = new Audio("tone.mp3");
    audio.play();
  };
  useEffect(() => {

    socket.on("message", async (msg: Message) => {
      setMessages((prev: any) => [...prev, msg]);
      // playNotificationSound();
      if (!isChatOpen) {
        setHasUnread(true);
        playNotificationSound();
        showDesktopNotification(msg.text, msg.from); // 👈
      }
    });
  }, [chatOpen]);


  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">

      <aside className="w-full lg:w-64 bg-black bg-opacity-80 p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-[#22b14c]">MaraPesa</h1>
        <nav>
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition duration-300 ${active === item.name
                ? "bg-[#22b14c] text-black"
                : "hover:bg-[#ed1c24]"
                }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActive(item.name)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <Link href={item.path}>{item.name}</Link>
            </motion.div>
          ))}
        </nav>

        <motion.div
          onClick={logout}
          className="flex items-center space-x-4 p-3 mt-6 rounded-lg cursor-pointer hover:bg-[#ed1c24]"
          whileHover={{ scale: 1.05 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          <span>Logout</span>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 relative">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold capitalize mb-2 sm:mb-0">{user?.username}</h2>
          <span className="text-xl sm:text-2xl text-[#22b14c]">
            Balance: {data?.total_amount}
          </span>
        </div>


        <div>{children}</div>


        {!isChatOpen && <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`fixed bottom-6 right-6 ${chatUsers.length === 0 || chatUsers === undefined ? "bg-green-100 hover:bg-green-400 text-slate-500" : "bg-[#22b14c] hover:bg-green-600 text-white "} px-4 py-2 rounded-full shadow-lg`}
        >
          {isChatOpen ? "Close Chat" : "Chat"}
        </button>}

        {isChatOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-80 bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 200 }}
            transition={{ duration: 0.3 }}
          >

            <div className="flex justify-between items-center bg-[#22b14c] text-black font-bold px-4 py-2 rounded-t-xl">
              <span>Chat</span>
              <svg xmlns="http://www.w3.org/2000/svg" onClick={() => setIsChatOpen(false)} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>

            </div>

            {/* User List or Chat View */}
            {!selectedUser ? (
              <div className="flex-1 overflow-y-auto">
                {chatUsers
                  .filter((u: any) =>
                    u.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((u: any) => (
                    <button
                      key={u._id}
                      onClick={() => { setSelectedUser(u); fetchConversationHistory(u._id) }}
                      className="w-full text-left px-4 py-3 hover:bg-[#ed1c24] transition border-b border-gray-700 flex items-center space-x-3"
                    >
                      {/* Avatar */}
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#22b14c] text-white flex items-center justify-center font-semibold">
                          {u.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span>{u.username}</span>
                    </button>
                  ))}
              </div>
            ) : (
              <>
                <ChatWindow
                  messages={messages}
                  fetchConversationHistory={fetchConversationHistory}
                  setMessages={setMessages}
                  toId={selectedUser?._id}
                  currentUser={user?.username}
                  chatwith={selectedUser?.username}
                  onClose={() => setSelectedUser(null)}
                  username={user?.username} />

              </>
            )}
          </motion.div>
        )}
        <button onClick={openChat} className="relative">

          {hasUnread && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          )}
        </button>
      </main>
    </div>
  );
}
