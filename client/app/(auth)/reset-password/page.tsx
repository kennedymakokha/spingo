'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
// import { requestOtp, verifyOtp, resetPassword } from "@/actions/authActions";  // Assuming these actions are available
import SuccessFailure from "@/components/successFailure";
import { setCookie } from "cookies-next";
import { requestOtp, resetPassword, verifyOtp } from "@/actions/authActions";

const ResetPasswordScreen = () => {
    const [step, setStep] = useState(1);  // Track which step we are in (1: request OTP, 2: verify OTP, 3: reset password)
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    const handleRequestOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!phoneNumber) {
            setError("Phone number is required.");
            return;
        }

        try {
            const response: any = await requestOtp(phoneNumber);
            console.log(response)
            if (response.success) {
                setSuccess(`OTP sent successfully! Check your  ***********${phoneNumber.slice(-3)}`);
                setStep(2);  // Move to the next step (OTP verification)
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
            const response = await verifyOtp({phoneNumber, otp});
            if (response.success) {
                setSuccess("OTP verified! Please set a new password.");
                setStep(3);  // Move to the next step (reset password)
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
            const response = await resetPassword(phoneNumber, newPassword);
            if (response.success) {
                setSuccess("Password reset successfully! You can now login.");
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
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <button type="submit" className="w-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md shadow-blue-400">
                                Request OTP
                            </button>
                        </motion.div>
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
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <button type="submit" className="w-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md shadow-blue-400">
                                Verify OTP
                            </button>
                        </motion.div>
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
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <button type="submit" className="w-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md shadow-blue-400">
                                Reset Password
                            </button>
                        </motion.div>
                    </form>
                )}

                <p className="text-center text-sm text-gray-600 mt-4">
                    Remember your password?
                    <button
                        onClick={() => router.push("/login")}
                        className="text-blue-500 hover:underline ml-1"
                    >
                        Login
                    </button>
                </p>
            </motion.div>
        </AnimatePresence>
    );
};

export default ResetPasswordScreen;
