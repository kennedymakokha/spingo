'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import { activateUser, loginUser, RegisterUser, verifyOtp } from "@/actions/authActions";
import { socket } from "@/components/socket";
import SuccessFailure from "@/components/successFailure";
import { setCookie } from "cookies-next";
import apiClient from "@/lib/apiClient";
// import { useLoginMutation } from "@/app/features/slices/userSlice";


const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [item, setitem] = useState({ phone_number: "", password: "", username: "", confirm_password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timer, setTimer] = useState(0);
    const [step, setStep] = useState(1);
    const [otp, setOtp] = useState("");
    const [user, setUser] = useState({});
    const router = useRouter();

    const startTimer = (time: any) => {
        socket.emit("restartBrowser", time)
        socket.on("browsertimerUpdate", (dur) => {
            setTimer(dur)
        })
    }

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
            if (response.success === true) {
                localStorage.setItem("accessToken", response.message.token);
                let expiry = new Date(parseInt(response?.message?.exp?.toString() || '0') * 1000)
                setCookie('sessionToken', response.message.token, { expires: expiry })
                setSuccess(isLogin ? "Login successful! Redirecting..." : "Registration successful! Please verify your account.");
                setTimeout(() => {
                    if (isLogin) {
                        router.push("/");
                        return
                    } else {
                        setStep(2);
                        setIsLogin(false)
                        startTimer(60)
                        return
                    }
                }, 2000); // Delay to show success message

            } else {
                if (response.message === "Kindly activate your account to continue") {
                    setStep(2);
                    setIsLogin(false)
                    startTimer(20)
                }
                setError(response.message);
            }

        } catch (error) {
            console.log(error)
            setError("An error occurred. Please try again.");
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setError("");
            if (!otp) {
                setError("Enter the OTP sent on ");
                return;
            }
            const res = await activateUser({
                phone_number: item.phone_number,
                otp: otp
            })
            if (res.success === true) {
                setSuccess("Account activated successfully! Redirecting...");
                setTimeout(() => {
                    setStep(1)
                    setIsLogin(true)
                    setSuccess("")
                    router.push("/login");
                }, 2000); // Delay to show success message
            } else {
                setError(res.message);
            }
            console.log(res)
        } catch (error) {
            console.log(error)
            setError("Enter the OTP sent on ");
        }
    };

    const fetchData = async () => {
        try {
            const response = await apiClient().get(`authenticated`);
            if (response) {
                setUser(response)
                router.push('/')
            }
        } catch (err) {
            router.push('/login')
            console.log(err)
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

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
                    {isLogin ? "Login" : !isLogin ? "Register" : !isLogin && step === 2 ? "Verify account" : ""}
                </h2>
                <SuccessFailure success={success} error={error} />

                {step === 1 && <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="number"
                        placeholder="phone number"
                        value={item.phone_number}
                        onChange={(e) => setitem(prev => ({
                            ...prev, phone_number: e.target.value
                        }))}
                    />
                    {!isLogin && <Input
                        placeholder="User name"
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
                        <button type="submit" className="w-full bg-[#22b14c] flex items-center justify-center hover:bg-[#22b14c] text-white font-semibold py-2 rounded-lg shadow-md shadow-[#22b14c]">
                            {isLogin ? "Login" : "Register"}
                        </button>
                    </motion.div>
                </form>}

                {step === 2 && (
                    <form onSubmit={handleVerification} className="space-y-4">
                        <Input
                            type="numeric"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <button type="submit" className="w-full bg-[#22b14c] flex items-center justify-center hover:bg-[#22b14c] text-white font-semibold py-2 rounded-lg shadow-md shadow-[#22b14c]">
                                submit
                            </button>
                        </motion.div>
                    </form>
                )}

                <p className="text-center text-sm text-gray-600 mt-4">
                    {step === 1 ? <>{isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-[#22b14c] hover:underline ml-1"
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </> : <>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className={`text-slate-500 ${timer === 1 && "bg-slate-400 px-4 py-2 rounded-md text-[#22b14c] font-bold"} shadow-2xl cursor-pointer  ml-1`}
                        >
                            {timer !== 1 ? `Resent code in ${timer} ` : "Resend"}
                        </button>
                    </>}
                </p>

                {step === 1 && isLogin && <p onClick={() => router.push('reset-password')} className="text-center hover:text-[#22b14c] cursor-pointer text-sm text-gray-400">Forgot Password</p>}
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthScreen;
