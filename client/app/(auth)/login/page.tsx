'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Input from "@/components/ui/input";
import { loginUser, RegistetrUser } from "@/actions/authActions";
// import { useLoginMutation } from "@/app/features/slices/userSlice";



const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [item, setitem] = useState({ phone_number: "", password: "", name: "", confirm_password: "" });

    const [error, setError] = useState("");

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

            let result
            if (isLogin) {
                result = await loginUser(item)
            }
            else {
                result = await RegistetrUser(item)
            }
            console.log(result)
            // const res = await login({ email, password }).unwrap();
            // dispatch(setCredentials({ ...res }))
            // Simulate login/signup success and redirect
            // router.push(`${isLogin ? "/" : "/account-verification"}`);
        } catch (error) {
            console.log(error)
        }
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
                    {isLogin ? "Login" : "Register"}
                </h2>
                {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
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
                        value={item.name}
                        onChange={(e) => setitem(prev => ({
                            ...prev, name: e.target.value
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
