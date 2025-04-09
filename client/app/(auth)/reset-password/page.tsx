'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import SuccessFailure from "@/components/successFailure";
import { requestOtp, resetPassword, verifyOtp } from "@/actions/authActions";
import { socket } from "@/components/socket";

const ResetPasswordScreen = () => {
    let Number = localStorage.getItem('phone');
    const [step, setStep] = useState(Number ? 2 : 1);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timer, setTimer] = useState(0);
    const router = useRouter();

    const PRIMARY_COLOR = "#22b14c";
    const SECONDARY_COLOR = "#ed1c24";

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phoneNumber) {
            setError("Phone number is required.");
            return;
        }

        try {
            const response: any = await requestOtp(phoneNumber);
            if (response.success) {
                setSuccess(`OTP sent successfully! Check your ***********${phoneNumber.slice(-3)}`);
                localStorage.setItem("phone", phoneNumber);
                setStep(2);
            } else {
                setError(response.message || "Failed to send OTP.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!otp) {
            setError("OTP is required.");
            return;
        }

        try {
            const response = await verifyOtp({ phone_number: Number, otp });
            if (response.success) {
                setSuccess("OTP verified! Please set a new password.");
                setStep(3);
            } else {
                setError(response.message || "Invalid OTP.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!newPassword || !confirmPassword) {
            setError("Both fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await resetPassword(Number, newPassword);
            if (response.success) {
                setSuccess("Password reset successfully! You can now login.");
                localStorage.removeItem("phone");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                setError(response.message || "Failed to reset password.");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        }
    };

    const startTimer = (time: any) => {
        socket.emit("restartBrowser", time);
        socket.on("browsertimerUpdate", (dur) => {
            setTimer(dur);
        });
    };

    useEffect(() => {
        startTimer(10);
    }, []);

    const Button = ({ children, type = "submit" }: { children: React.ReactNode; type?: "button" | "submit" }) => (
        <motion.div whileHover={{ scale: 1.05 }}>
            <button
                type={type}
                style={{ backgroundColor: PRIMARY_COLOR }}
                className="w-full flex items-center justify-center text-white font-semibold py-2 rounded-lg shadow-md"
            >
                {children}
            </button>
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="reset-password"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 bg-white p-8 rounded-2xl h-full flex-col justify-center flex md:h-auto shadow-2xl w-full max-w-md border border-gray-200 backdrop-blur-lg bg-opacity-80"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Reset Password</h2>
                <SuccessFailure success={success} error={error} />

                {step === 1 && (
                    <form onSubmit={handleRequestOtp} className="space-y-4">
                        <Input
                            type="numeric"
                            placeholder="Phone number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <Button>Request OTP</Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <Button>Verify OTP</Button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <Button>Reset Password</Button>
                    </form>
                )}

                <p className="text-center text-sm text-gray-600 mt-4">
                    Remember your password?
                    <button
                        onClick={() => router.push("/login")}
                        className="text-[--primary] hover:underline ml-1"
                        style={{ color: PRIMARY_COLOR }}
                    >
                        Login
                    </button>
                </p>

                {Number && step === 2 && (
                    <button
                        className={`text-slate-500 ${timer === 1 ? "bg-slate-200 px-4 py-2 rounded-md font-bold" : ""} shadow-2xl cursor-pointer ml-1`}
                        style={{ color: timer === 1 ? PRIMARY_COLOR : SECONDARY_COLOR }}
                    >
                        {timer !== 1 ? `Resent code in ${timer}` : "Resend"}
                    </button>
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default ResetPasswordScreen;
