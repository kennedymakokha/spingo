"use client"
import CardLoader from '@/components/loader'
import { socket } from '@/components/socket'
import React, { useEffect } from 'react'




const page = () => {
    // socket.emit("startGame", 20);
    useEffect(() => {
        console.log("first")
        socket.on("timerUpdate", (dur) => {
            console.log(dur)
        })
    }, [])
    useEffect(() => {
        console.log("first")
        socket.on("flipCoin", (dur) => {
            console.log(dur)
        })
    }, [])
    return (
        <div>
            <CardLoader/>
        </div>
    )
}

export default page