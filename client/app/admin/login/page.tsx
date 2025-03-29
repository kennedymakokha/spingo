'use client'
import { loginAdmin, loginUser } from '@/actions/authActions';
import { setCookie } from 'cookies-next';
import { useRouter } from "next/navigation";
import { useState } from 'react';

const Login = () => {
    const [item, setItem] = useState({ phone_number: "", password: "" });
    const [error, setError] = useState("");
    const router = useRouter();
    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();
    //     console.log('Logging in with:', { email, password });
    // };
    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setError("");
            if (!item.phone_number || !item.password) {
                setError("Both fields are required");
                return;
            }

            // Call login or registration API

            const response = await loginAdmin(item);
            if (response.success === true) {
                localStorage.setItem("adminsessionToken", response.message.token);
                let expiry = new Date(parseInt(response?.message?.exp?.toString() || '0') * 1000)
                setCookie('admin-sessionToken', response.message.token, { expires: expiry })
                setTimeout(() => {
                    router.push("/admin");
                    return

                }, 2000); // Delay to show success message

            } else {
                setError(response.message);
            }

        } catch (error) {
            console.log(error)
            setError("An error occurred. Please try again.");
        }
    };
    return (
        <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-500">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full transform transition-all duration-500 hover:scale-105 hover:shadow-xl">
                <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
                    Sign In
                </h2>
                {error && <div className="flex bg-red-400 px-2  rounded-md items-center  justify-center ">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="number"
                            id="phone_number"
                            value={item.phone_number}
                            onChange={(e) => setItem(prev => ({
                                ...prev, phone_number: e.target.value
                            }))}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={item.password}
                            onChange={(e) => setItem(prev => ({
                                ...prev, password: e.target.value
                            }))}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200"
                    >
                        Log In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
