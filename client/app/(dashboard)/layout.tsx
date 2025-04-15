"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import headsImage from "@/public/coin-heads.png";
import bgImage from "@/public/spinbg.webp";
import tailsImage from "@/public/coin-tails.png";
import { socket } from "@/components/socket";
import TypewriterEffect from "@/components/typewriter";
import apiClient from "@/lib/apiClient";
import { BetData, WalletData } from "@/types/transactions";
import { useRouter } from "next/router";
import Link from "next/link";

function getRandomColor() {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
    return colors[Math.floor(Math.random() * colors.length)];
}
export default function page({ children }: { children: React.ReactNode }) {
    const [isFlipping, setIsFlipping] = useState(false);
    const [result, setResult] = useState<string | null | any>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [stake, setStake] = useState<number>(10);
    const [spin_id, setSpin_id] = useState<any>("");
    const [balance, setBalance] = useState<number>(0);
    const [timer, setTimer] = useState<number | null>();
    const [restartTime, setRestartTime] = useState<number>(0);
    const [canPlay, setCanPlay] = useState(false);
    const [stacked, setStacked] = useState(false);
    const [data, setData] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    // const router = useRouter();

    const post_bet = async (result: any) => {

        try {
            await apiClient().post<BetData[]>(`predictions`, {
                stake: stake,
                outcome: result,
                spin_id: spin_id,
                prediction: prediction
            });
        } catch (err) {
            console.log(err)
            // setError("Error loading data");
        }
    };
    const handleFlip = async () => {
        setStacked(true)
        // if (!prediction || stake <= 0 || stake > balance || !canPlay) return;
        // setIsFlipping(true);
        // setIsCorrect(null);
        // socket.emit("flipCoin", { prediction });

        // // setIsFlipping(false)
    };
    const fetchData = async () => {
        try {
            const response = await apiClient().get<WalletData>(`wallet`);
            const res = await apiClient().get(`authenticated`);
            setUser(res?.data)
            setData(response.data);
            setBalance(response?.data?.total_amount)
        } catch (err) {
            console.log(err)
        }
    };
    useEffect(() => {
        fetchData();
    }, [balance]);
    const clear = () => {
        setIsFlipping(false)
        setResult(null)
        setPrediction(null)
        setIsCorrect(null);
    }
    useEffect(() => {
        // socket.emit("startGame", 20);
        socket.on("timerUpdate", (dur) => {
            setTimer(dur)
            if (dur === 0) { setIsFlipping(true) }

            // }

        })
    }, [])

   





    return (
        <div className="flex relative z-0 flex-col items-center justify-center h-screen bg-gray-900  text-white">
            <Image src={bgImage} alt="result" className="w-full h-full object-cover" width={1200} height={1200} />

            <div className="absolute top-4 left-4 z-30">
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="inline-flex justify-center w-full rounded-md border border-green-600 shadow-sm px-4 py-2 bg-green-500 text-white hover:bg-green-600 font-medium transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>

                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 ${menuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                    >
                        <div className="py-1">
                            <Link
                                href="/"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                🏠 Home
                            </Link>
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                👤 Profile
                            </Link>
                            <Link
                                href="/history"
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                📜 Bet History
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
            <>
                {children}
            </>

            <div className="absolute inset-0 flex justify-center bg-black opacity-80 items-center z-10"></div>
        </div >
    );
}
