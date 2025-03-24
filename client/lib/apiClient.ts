import axios from "axios";
import { getCookie } from "cookies-next";

const apiClient = () => {
    let token = getCookie('sessionToken') || null
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Set this in .env.local
        headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        withCredentials: true, // If your API requires credentials
    });
    if (token) {
        // Apply To Every Request
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        // Delete Auth Header
        delete instance.defaults.headers.common['Authorization']
    }
    return instance
};

export default apiClient;
