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
import { menuItems } from './../data.json'



export default function Dashboard({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState("Dashboard");
  const [user, setUser] = useState<UserData>();
  const [data, setData] = useState<any>();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const [chatUsers, setChatUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

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
      socket.emit("update-wallet", response.data._id);

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

  useEffect(() => {

    socket.on("update-wallet", async (msg) => {
      console.log("MSG", "msg")

      // setData(result?.data);
    });
  }, [data]);
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">

      <motion.aside
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-black bg-opacity-90 p-6 shadow-lg transition-transform transform lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:h-auto lg:w-64`}
        initial={false}
        animate={{ x: mobileMenuOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="pl-10 lg:pl-0"><span className="text-[#22b14c]">MARA</span><span className="text-[#ed1c24]">PESA</span></div>
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
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
      </motion.aside>


      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 relative">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 6.75h15m-15 5.25h15m-15 5.25h15"
            />
          </svg>
        </button>
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black opacity-70 z-30 lg:hidden"
          />
        )}
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
                <div className="p-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-slate-50 transition"
                  />
                </div>
                {chatUsers
                  .filter((u: any) =>
                    u.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((u: any) => (
                    <button
                      key={u._id}
                      onClick={() => { setSelectedUser(u); fetchConversationHistory(u._id) }}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 transition border-b border-gray-700 flex items-center space-x-3"
                    >
                      {/* Avatar */}
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.username}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-400 text-slate-600 flex items-center justify-center font-semibold">
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
