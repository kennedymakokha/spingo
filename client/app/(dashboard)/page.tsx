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
export default function page() {
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
        console.log("deleting")
        setIsFlipping(false)
        setResult(null)
        setPrediction(null)
        setIsCorrect(null)
    }
    useEffect(() => {

        socket.on("timerUpdate", (dur) => {
            setTimer(dur)
            if (dur === 0) {
                setIsFlipping(true)
                // if (result)
                setTimeout(() => setIsFlipping(false), 7000)
            }

        })
    }, [])
    useEffect(() => {
        socket.on("flipCoin", res => {
            console.log(res)
            setResult(res);
            //         setSpin_id(flipResult.spin_id)
            let correct = false
            if (res === prediction) {
                correct = true
            }
            console.log("first", prediction === res, prediction, res)
            setIsCorrect(correct);
        });
    }, [result]);
    useEffect(() => {
        // socket.emit("startGame", 20);
        if (!user) {
            setBalance(4000)
        }
    }, [])
    console.log("RESULT", result, isCorrect, prediction)
    return (
        <>
            <div className="absolute inset-x-0 capitalize bottom-6 h-10   flex justify-center items-center z-12">
                <div style={{ fontFamily: 'Courier New', fontSize: '24px', color: 'white' }}>
                    {restartTime > 2 && `Game restarts in ${restartTime} seconds `}
                </div>
            </div>
            {!user ? <div className="absolute right-[10%] top-2 h-10  flex justify-center items-center z-12">
                <p style={{ textShadow: `0px 0px 19px white ` }} className={`text-lg  font-semibold mb-4  ${isCorrect === null && !isFlipping ? "text-white" : isCorrect === true && !isFlipping && result ? "text-green-200" : "text-red-500"}`}>Balance: Ksh {balance}</p>
            </div> :
                <div className="absolute right-[10%] top-2 h-10  flex justify-center items-center z-12">
                    <p style={{ textShadow: `0px 0px 19px  ${isCorrect === null ? "white" : isCorrect === true ? "green" : "red"}` }} className={`text-lg  font-semibold mb-4  ${isCorrect === null && !isFlipping ? "text-white" : isCorrect === true && !isFlipping && result ? "text-green-200" : "text-red-500"}`}>Balance: Ksh {balance}</p>
                </div>}
            <div className="absolute inset-0 flex justify-center    items-center z-12">

                <div style={{ boxShadow: result && !isFlipping && !isCorrect && prediction !== null ? "0px 0px 800px red" : "0px 0px 10px #00f2ff" }} className={`flex bg-gray-900   ${result && !isFlipping && !isCorrect && prediction !== null ? "border border-[red]" : "border-[#00f2ff]"} min-w-[300px] items-center justify-center flex-col p-5 rounded-md`}>
                    {/* <h1 className="text-3xl font-bold mb-6 text-cyan-400">Coin Flip</h1> */}

                    {timer !== null && (
                        <p className="text-lg font-bold text-yellow-400">Game starts in: {timer} seconds</p>
                    )}

                    <div className="flex flex-col items-center">
                        <motion.div
                            className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                            animate={isFlipping ? { rotateX: 1800 } : { rotateX: 0 }}
                            transition={isFlipping ? { duration: 2, ease: "easeInOut" } : { duration: 0.5 }}
                        >
                            {result ? (
                                <Image src={result === "heads" ? headsImage : tailsImage} alt={result} width={128} height={128} />
                            ) : (
                                <Image src={headsImage} alt="result" width={128} height={128} />
                            )}
                        </motion.div>
                        <div className="mt-4">
                            <label className="block text-gray-300 text-sm mb-2">Stake Amount</label>
                            <input
                                type="number"
                                className="px-4 py-2 text-black rounded-lg w-24 text-slate-200 text-center"
                                value={stake}
                                onChange={(e) => setStake(Math.max(1, Math.min(balance, Number(e.target.value))))}
                                disabled={canPlay}
                            />
                        </div>
                        <div className="mt-4 flex space-x-4">
                            <button
                                className={`px-4 py-2 min-w-20 rounded-lg font-bold ${prediction === "heads" ? "bg-green-500 text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                                    }`}
                                onClick={() => {
                                    clear()
                                    setPrediction("heads");
                                    socket.emit("place-bet", { uuid: user?._id, bet: "heads" })
                                }}
                                disabled={canPlay}
                            >
                                Head
                            </button>
                            <button
                                className={`px-4 min-w-20 py-2 rounded-lg font-bold ${prediction === "tails" ? "bg-green-500 text-black" : "bg-gray-700 text-white hover:bg-gray-600"
                                    }`}
                                onClick={
                                    () => { clear(); setPrediction("tails"), socket.emit("place-bet", ({ uuid: user?._id, bet: "tails" })) }}
                                disabled={canPlay}
                            >
                                Tail
                            </button>
                        </div>



                        {stake && <button
                            className="mt-6 px-6 py-3 bg-green-500 text-black font-bold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition duration-300"
                            onClick={handleFlip}
                            disabled={isFlipping || !prediction || stake > balance}
                        >
                            {stacked ? "You have staked ${10}" : isFlipping ? "Flipping..." : `Stake ${stake}`}
                        </button>}

                        {
                            isCorrect !== null && !isFlipping && (
                                <motion.div
                                    className="mt-6 text-2xl font-bold"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {prediction ? <>
                                        {isCorrect ? (
                                            <span className="text-green-400">🎉 Correct! You won Ksh {stake}!</span>
                                        ) : (
                                            <span className="text-red-400">❌ Wrong! You lost Ksh {stake}.</span>
                                        )}
                                    </> :
                                        <span className="text-green-400">You did not Predict .</span>
                                    }

                                </motion.div>
                            )
                        }
                    </div >
                </div >

            </div >

            {isCorrect !== null && isCorrect === true && !isFlipping && <div className="absolute insert-x-0 bottom-[20%] flex justify-center w-[20%] items-center z-12">
                <div className="w-1/2">
                    {[...Array(10)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-10 h-10 bg-red-400 rounded-full"
                            initial={{ opacity: 1, y: 0, scale: 1 }}
                            animate={{ opacity: 0, y: -200, scale: 2 }}
                            transition={{ duration: 2, delay: i * 0.2 }}
                            style={{ left: `${Math.random() * 100}%`, backgroundColor: getRandomColor() }}
                        />
                    ))}
                </div>
            </div>}
        </>
    );
}
