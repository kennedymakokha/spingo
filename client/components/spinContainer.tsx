'use client'
import React, { useEffect, useState } from 'react'
import { io } from "socket.io-client";
import Link from "next/link";
const socket = io(`http://localhost:3000`)
var url = window.location.href;
var lastSlashIndex = url.lastIndexOf('/');
export var lastSegment = url.substring(lastSlashIndex + 1);
const GlowAnim = ({ title, action, time, item, src, value, left, right }: any) => {
    return (
        <button onClick={action} className={`relative bg-primary-300 px-6 py-3 flex items-center ${time === 0 && "bg-slate-400"} justify-center gap-x-2  border   text-black  ${lastSegment === "" && "rounded-full"} ${left ? "rounded-l-full" : ""} ${right ? "rounded-r-full" : ""}  shadow  
 transition-all duration-300 ease-in-out ${item.choice === value ? "bg-primary-300" : " md:text-blue-400"}`}>
            {src && item.choice === value ? <img src={src} className='w-6  rounded-full shadow-[0_0_15px_5px_rgba(236,72,153,1)]  shadow-blue-400 ' /> : <span className='text-slate-800'>{title}</span>}
        </button>
    )
}
export const SpinContainer = ({ props }: any) => {
    const [item, setItem] = useState({ bet: 0, choice: 2 });
    const [headsBet, setHeadsBet] = useState(0);
    const [tailsBet, setTailsBet] = useState(0);
    const [time, setTime] = useState(0);

    // const Placebet = () => {
    //     socket.emit("place-bet", item);
    //     socket.on("status3", (msg) => {
    //         let formattedTime = msg < 10 ? "0" + msg : msg;
    //         document.querySelector("#timer").textContent = `00 : ${formattedTime}`;
    //     });
    // };

    useEffect(() => {
        const handleStatus = (msg: any) => {
            let formattedTime = msg < 10 ? "0" + msg : msg;
            setTime(msg);
            // document.querySelector("#timer").textContent = `00 : ${formattedTime}`;
        };

        const handleResult = () => {
            let result = headsBet < tailsBet ? 1 : 0; // Least bet wins

            setTimeout(() => {
                const coin: any = document.querySelector(".coin");
                if (coin) {
                    coin.style.animation = "none";
                    void coin.offsetWidth;
                    coin.style.animation =
                        result === 1 ? "spin-heads 5s forwards" : "spin-tails 5s forwards";
                }
            }, 1000);
        };

        socket.on("status", handleStatus);
        socket.on("result", handleResult);

        return () => {
            socket.off("status", handleStatus);
            socket.off("result", handleResult);
        };
    }, [headsBet, tailsBet]);

    return (
        <>
            <div className="text-center">
                <span
                    className="text-primary-300 font-bold text-[20px]"
                    id="timer"
                ></span>
            </div>

            <div className="flex w-full items-center justify-center h-40 rounded-md">
                <div className="coin w-1/3" id="coin">
                    <div
                        className={`heads rounded-full shadow-[0_0_15px_5px] ${item.bet === 1 ? "shadow-primary-400" : "shadow-primary-200"
                            }`}
                    >
                        <img src="./images/head.png" />
                    </div>
                    <div
                        className={`tails rounded-full shadow-[0_0_15px_5px] ${item.bet === 0 ? "shadow-primary-400" : "shadow-primary-200"
                            }`}
                    >
                        <img src="./images/tail.png" />
                    </div>
                </div>
            </div>

            <div className="bet flex justify-between gap-x-3">
                <div
                    onClick={() => time !== 0 && setItem({ ...item, choice: 0 })}
                    className="h-[40px] flex justify-center items-center font-bold w-1/2"
                >
                    <GlowAnim
                        time={time}
                        src="./images/tail.png"
                        item={item}
                        left
                        value={0}
                        title="Tails"
                    />
                </div>
                <div
                    onClick={() => time !== 0 && setItem({ ...item, choice: 1 })}
                    className="h-[40px] flex justify-center items-center font-bold w-1/2"
                >
                    <GlowAnim
                        item={item}
                        src="./images/head.png"
                        value={1}
                        title="Heads"
                        right
                    />
                </div>
            </div>

            <div className="buttons flex flex-col justify-center w-full">
                <div className="h-[50px] flex text-primary-500 justify-center items-center uppercase rounded-[5px] w-full">
                    <input
                        className="border flex h-[50px] px-3 bg-transparent w-full p-1 rounded-[5px]"
                        type="number"
                        placeholder="Enter Stake"
                        onChange={(e) => {
                            const betAmount = parseInt(e.target.value, 10) || 0;
                            setItem({ ...item, bet: betAmount });
                            if (item.choice === 1) setHeadsBet((prev) => prev + betAmount);
                            else setTailsBet((prev) => prev + betAmount);
                        }}
                        name="bet"
                        min={10}
                    />
                </div>
            </div>

            <div className="text-primary-500 mt-5 flex justify-center items-center font-bold rounded-[5px] w-full">
                <button
                    className="h-[50px] w-full flex items-center justify-center"
                    id="flip-button"
                    style={{
                        backgroundColor:
                            time === 0 ? "rgb(148 163 184)" : "rgb(96 165 250)",
                    }}
                // onClick={Placebet}
                >
                    {time !== 0
                        ? "Bet to Win!"
                        : item.choice === 1
                            ? "Complete"
                            : "Spinning"}
                </button>
            </div>
        </>
    );
};

export default SpinContainer