'use client'
import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
export default function AdminLayout({ children }: { children: ReactNode }) {
    const [isUsersOpen, setIsUsersOpen] = useState<any>(null);

    const toggleUsers = () => {
        setIsUsersOpen(!isUsersOpen);
    };
    return (
        <div className="flex h-screen bg-gray-900 shadow-3lg rounded-md">
            {/* Sidebar */}
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
                <ul className="mt-8">
                    <li>
                        <Link href="/admin" className="block py-2 px-4 hover:bg-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <div>
                            <button
                                onClick={toggleUsers}
                                className="w-full text-left flex justify-between items-center px-4 py-2 hover:bg-gray-700"
                            >
                                Users
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-4 h-4 transition-transform duration-300"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d={
                                            !isUsersOpen
                                                ? "M19.5 8.25L12 15.75L4.5 8.25"
                                                : "M4.5 15.75L12 8.25L19.5 15.75"
                                        }
                                    />
                                </svg>
                            </button>
                            <motion.div
                                initial={{ opacity: 0, maxHeight: 0 }}
                                animate={{
                                    opacity: isUsersOpen ? 1 : 0,
                                    maxHeight: isUsersOpen ? '500px' : 0,
                                }}
                                transition={{ duration: 0.5 }}
                                className="overflow-hidden"
                            >
                                <ul className="pl-6 mt-2">
                                    <li>
                                        <Link href="/admin/users/admins" className="block py-2 px-4 capitalize hover:bg-gray-700">
                                            Administrators
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin/users" className="block py-2 px-4 hover:bg-gray-700">
                                            Investors
                                        </Link>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </li>
                    <li>
                        <Link href="/admin/statistics" className="block py-2 px-4 hover:bg-gray-700">
                            Statistics
                        </Link>
                    </li>
                </ul>
            </div>

            <div className="flex-1 flex flex-col shadow-2xl rounded-b-full">
                {/* Navbar */}
                <div className=" text-white px-4 py-2  flex  justify-between items-center">
                    <div className="text-2xl font-semibold"></div>
                    <div>
                        <button className="bg-indigo-700 py-2 px-4 rounded-md hover:bg-indigo-800">
                            Logout
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 px-8 bg-gray-900 ">{children}</div>
            </div>
        </div>
    );
}
