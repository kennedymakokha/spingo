'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import bgImage from "@/public/spinbg.webp";
import Input from "@/components/ui/input";
// import { useLoginMutation } from "@/app/features/slices/userSlice";



const AuthScreen = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    // const dispatch = useDispatch
    // const [login, isFetching,] = useLoginMutation();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Both fields are required");
            return;
        }
        // const res = await login({ email, password }).unwrap();
        // dispatch(setCredentials({ ...res }))
        // Simulate login/signup success and redirect
        router.push("/dashboard");
    };

    return (
        <div className="flex relative z-0 items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
            {/* Glowing effect */}
            <Image src={bgImage} alt="result" className="w-full h-full object-cover" width={1200} height={1200} />

            <div className="absolute inset-0 flex flex-col  justify-center items-center z-12">
                <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <motion.div
                    className={`text-white ${!isLogin ? "" : "text-4xl mb-6 "} font-bold flex text-center flex-col`}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    MARAPESA
                    <span className="lowercase font-thin text-[20px] text-pink-500">Multiply it </span>
                </motion.div>
                
                {children}
            </div>
            <div className="absolute inset-0 bg-black opacity-60 flex justify-center items-center z-10"></div>


        </div>



    );
};

export default AuthScreen;
