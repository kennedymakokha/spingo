'use client'
import { JSX, useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";

export default function Navbar(): JSX.Element {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const menuItems: string[] = ["Home", "About", "Services", "Contact"];

    return (
        <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-80 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                    <motion.div
                        className="text-2xl font-bold text-white cursor-pointer"
                        whileHover={{ textShadow: "0px 0px 8px #00f2ff" }}
                    >
                        NeonNav
                    </motion.div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6">
                    {menuItems.map((item, index) => (
                        <motion.a
                            key={index}
                            href={`#${item.toLowerCase()}`}
                            className="text-white text-lg relative"
                            whileHover={{ color: "#00f2ff", textShadow: "0px 0px 8px #00f2ff" }}
                        >
                            {item}
                        </motion.a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" : "M6 18 18 6M6 6l12 12"}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    className="md:hidden flex flex-col items-center bg-black bg-opacity-90 py-4 space-y-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                >
                    {menuItems.map((item, index) => (
                        <a
                            key={index}
                            href={`#${item.toLowerCase()}`}
                            className="text-white text-lg"
                            onClick={() => setIsOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                </motion.div>
            )}
        </nav>
    );
}
