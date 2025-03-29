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
// import { cookies } from "next/head/ers";

const menuItems = [
  { name: "Dashboard", icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", path: "/" },
  { name: "Analytics", icon: "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941", path: "/analytics" },
  { name: "Wallet", icon: "M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3", path: "/wallet" },
];
const adminmenuItems = [
  { name: "Dashboard", icon: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", path: "/" },
  { name: "Analytics", icon: "M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941", path: "/analytics" },
  { name: "Users", icon: "M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3", path: "/wallet" },
];
export default function Dashboard({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [active, setActive] = useState("Dashboard");
  const router = useRouter()
  const [user, setUser] = useState<UserData>();
  const [data, setData] = useState<any>();
  // const cookieStore: any = cookies();
  const fetchData = async () => {
    try {
      const response = await apiClient().get(`authenticated`);
      const result = await apiClient().get<any>(`wallet`);
      setData(result?.data);
      setUser(response.data)
    } catch (err) {
      router.push('/login')
      console.log(err)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const logout = async () => {
    await LogOutUser()
    localStorage.removeItem("accessToken");
    setCookie('sessionToken', '', { expires: new Date(0) });

    router.push("/login");
    socket.on('disconnect', () => {
      console.log('Disconnected from socket')
    })
  }

  // [...Array(6)]
  return (
    <div className="flex min-h-[100vh] min-w-[100vw]  bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black bg-opacity-80 p-6 flex flex-col justify-between shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-center mb-6 text-cyan-400">MaraPesa</h1>
          <nav>
            {menuItems.map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition duration-300 ${active === item.name ? "bg-cyan-500 text-black" : "hover:bg-gray-800"
                  }`}
                whileHover={{ boxShadow: "0px 0px 10px #00f2ff" }}
                onClick={() => setActive(item.name)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                <Link href={item.path}>{item.name}</Link>
              </motion.div>
            ))}
          </nav>
        </div>

        <motion.div
          onClick={logout}
          className="flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-gray-800"
          whileHover={{ boxShadow: "0px 0px 10px #ff0055" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>

          <span>Logout</span>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 min-w-[60vw] overflow-hidden">
        <div className="flex items-center w-full justify-between">
          <h2 className="text-3xl font-bold text-end capitalize   mb-4">  {user?.username}</h2>
          <span className="text-3xl "> Balance :{data?.total_amount}</span>
        </div>
        {children}
      </main>
    </div>
  );
}
