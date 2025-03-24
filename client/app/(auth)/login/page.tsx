'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import { loginUser, RegisterUser, } from "@/actions/authActions";
import { socket } from "@/components/socket";
import SuccessFailure from "@/components/successFailure";
import { setCookie } from "cookies-next";
// import { useLoginMutation } from "@/app/features/slices/userSlice";




const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [item, setitem] = useState({ phone_number: "0720141537", password: "makokha123", username: "", confirm_password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();
    // const dispatch = useDispatch
    // const [login, isFetching,] = useLoginMutation();
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setError("");
            if (!item.phone_number || !item.password) {
                setError("Both fields are required");
                return;
            }
            if (!isLogin && item.password !== item.confirm_password) {
                setError("Passwords do not match");
                return;
            }
            // Call login or registration API
            const response = isLogin ? await loginUser(item) : await RegisterUser(item);
            // const finalresult = await response.json()

            if (!response.ok) {
                console.log(response)
                throw new Error(response?.error || "An error occurred.");
            }
            localStorage.setItem("accessToken", response.token);
            let expiry = new Date(parseInt(response?.exp?.toString() || '0') * 1000)
            setCookie('sessionToken', response.token, { expires: expiry })

            // Show success message
            setSuccess(isLogin ? "Login successful! Redirecting..." : "Registration successful! Please verify your account.");

            setTimeout(() => {
                if (isLogin) {

                    router.push("/");
                } else {
                    router.push("/account-verification");
                }
            }, 2000); // Delay to show success message


        } catch (error) {
            console.log(error)
            setError("An error occurred. Please try again.");
        }
    };
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to socket");
        });

        return () => {
            socket.off("connect");
        };
    }, []);

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
                    {isLogin ? "Login" : "Register"}
                </h2>
                <SuccessFailure success={success} error={error} />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="numeric"
                        placeholder="phone number"
                        value={item.phone_number}
                        onChange={(e) => setitem(prev => ({
                            ...prev, phone_number: e.target.value
                        }))}
                    />
                    {!isLogin && <Input
                        placeholder="Name"
                        value={item.username}
                        onChange={(e) => setitem(prev => ({
                            ...prev, username: e.target.value
                        }))}
                    />}
                    <Input
                        type="password"
                        placeholder="Password"
                        value={item.password}
                        onChange={(e) => setitem(prev => ({
                            ...prev, password: e.target.value
                        }))}
                    />
                    {!isLogin && <Input
                        type="password"
                        placeholder="confirm Password"
                        value={item.confirm_password}
                        onChange={(e) => setitem(prev => ({
                            ...prev, confirm_password: e.target.value
                        }))}
                    />}

                    <motion.div whileHover={{ scale: 1.05 }}>
                        <button type="submit" className="w-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md shadow-blue-400">
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </motion.div>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-500 hover:underline ml-1"
                    >
                        {isLogin ? "Sign up" : "Login"}
                    </button>
                </p>
            </motion.div>
        </AnimatePresence>


    );
};

export default AuthScreen;
