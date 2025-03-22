'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import bgImage from "@/public/spinbg.webp";
import Input from "@/components/ui/input";
// import { useLoginMutation } from "@/app/features/slices/userSlice";



const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [otp, setotp] = useState("");

    const [error, setError] = useState("");
    const router = useRouter();
    // const dispatch = useDispatch
    // const [login, isFetching,] = useLoginMutation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!otp) {
            setError("Both fields are required");
            return;
        }
        // const res = await login({ otp, password }).unwrap();
        // dispatch(setCredentials({ ...res }))
        // Simulate login/signup success and redirect
        router.push("/login");
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 bg-white p-8 rounded-2xl h-full flex-col justify-center flex md:h-auto shadow-2xl w-full max-w-md border border-gray-200 backdrop-blur-lg bg-opacity-80"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    Account verification
                </h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="numeric"
                        placeholder="OTP"
                        value={otp}
                        onChange={(e) => setotp(e.target.value)}
                    />


                    <motion.div whileHover={{ scale: 1.05 }}>
                        <button type="submit" className="w-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md shadow-blue-400">
                            submit
                        </button>
                    </motion.div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    otp expires in 15 sec
                    <button
                        onClick={() => console.log("first")}
                        className="text-blue-500 hover:underline ml-1"
                    >
                        resend
                    </button>
                </p>
            </motion.div>
        </AnimatePresence>


    );
};

export default AuthScreen;
