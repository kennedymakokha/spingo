/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axios from "axios";
import { parseServerActionResponse } from "../lib/utils";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";
import { setCookie } from 'cookies-next';
// import { auth } from "@/auth";
// import { parseServerActionResponse } from "@/lib/utils";
export const fetchwallet = async () => {

    const cookieStore: any = cookies();
    // console.log("Cookies available:", cookieStore.getAll());
    // return
    const token = cookieStore.get("token")?.value; // Assuming you store the JWT in a cookie

    if (!token) {
        console.log("unauth")
    }

    try {
        const api = apiClient();
        const { data } = await api.get("/wallet");
        return parseServerActionResponse({ ...data, error: "", status: "SUCCESS" })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}
export const loginUser = async (form: any) => {
    const { phone_number, password } = form

    try {
        const user = {
            phone_number, password
        }
        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, requestOptions)
        const responseData = await result.json()

        if (result.status === 200) {
            return parseServerActionResponse({ ...result, error: "", status: 200, success: true, message: responseData })
        }
        else {

            return { success: false, message: responseData };
        }

    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}
export const loginAdmin = async (form: any) => {
    const { phone_number, password } = form

    try {
        const user = {
            phone_number, password
        }
        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/admin-login`, requestOptions)
        const responseData = await result.json()

        if (result.status === 200) {
            return parseServerActionResponse({ ...result, error: "", status: 200, success: true, message: responseData })
        }
        else {

            return { success: false, message: responseData };
        }

    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}

export const RegisterUser = async (form: any) => {


    const { phone_number, password, username, } = form

    try {
        const user = {
            phone_number, password, username
        }
        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, requestOptions)

        const responseData = await result.json()
        return parseServerActionResponse({ ...responseData, error: "", success: true, message: responseData })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }
}
export const LogOutUser = async () => {
    try {

        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
        };
        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, requestOptions)

        const finalresult = await result.json()
        console.log(finalresult)
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })

    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}
export const authUser = async () => {
    try {

        const requestOptions = {
            method: "GET", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type

        };

        const result = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, requestOptions)

        const finalresult = await result.json()
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}

export const requestOtp = async (form: any) => {

    try {
        // const response = await axios.post<any>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/request-otp`, { phoneNumber });

        const user = {
            phone_number: form
        }
        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };

        const response: any = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/request-otp`, requestOptions)
        const responseData = await response.json();
        if (response.status === 200) {
            return parseServerActionResponse({ ...response, error: "", status: 200, success: true, message: responseData })
        }
        else {

            return { success: false, message: response?.data?.message || responseData };
        }
    } catch (error) {
        // const responseData = await response.json();
        return { success: false, message: 'An error occurred. Please try again later.' };
    }
};

// Function to verify the OTP
export const verifyOtp = async (form: any): Promise<any> => {
    try {
        const { phone_number, otp } = form
        const user = {
            phone_number,
            code: otp
        }

        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };

        const response: any = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth//verify-otp`, requestOptions)
        const responseData = await response.json();

        if (response.status === 200) {
            console.log(responseData)
            return parseServerActionResponse({ ...response, error: "", status: 200, success: true, message: responseData })
        }
        else {

            return { success: false, message: responseData };
        }

    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred. Please try again later.' };
    }
};

export const activateUser = async (form: any): Promise<any> => {
    try {
        const { phone_number, otp } = form
        const user = {
            phone_number,
            code: otp
        }

        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };

        const response: any = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/activate-user`, requestOptions)
        const responseData = await response.json();
        // console.log(response)
        console.log(responseData)
        if (response.status === 200) {
            console.log(responseData)
            return parseServerActionResponse({ ...response, error: "", status: 200, success: true, message: responseData })
        }
        else {

            return { success: false, message: responseData };
        }

    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred. Please try again later.' };
    }
};

// Function to reset the password
export const resetPassword = async (phoneNumber: string | any, newPassword: string): Promise<any> => {
    try {
        const response = await axios.post<any>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/reset-password`, { phone_number: phoneNumber, newPassword });
        if (response.status === 200 && response.data.success) {
            // Optionally, set a cookie or do any further processing, like logging in the user.
            if (response.data.token) {
                setCookie('auth_token', response.data.token, { maxAge: 60 * 60 * 24 });  // Example of setting a cookie
            }
            return { success: true, message: 'Password reset successfully!' };
        } else {
            return { success: false, message: response.data.message || 'Failed to reset password' };
        }
    } catch (error) {
        console.error(error);
        return { success: false, message: 'An error occurred. Please try again later.' };
    }
};
// // Function to request an OTP
// export const requestOtp = async (phoneNumber: string) => {
//     try {
//         const response = await apiClient.post(`request-otp`, { phoneNumber });
//         if (response.status === 200 && response.data.success) {
//             return { success: true, message: 'OTP sent successfully!' };
//         } else {
//             return { success: false, message: response.data.message || 'Failed to send OTP' };
//         }
//     } catch (error) {
//         console.error(error);
//         return { success: false, message: 'An error occurred. Please try again later.' };
//     }
// };

// // Function to verify the OTP
// export const verifyOtp = async (phoneNumber: string, otp: string) => {
//     try {
//         const response = await apiClient.post<any>(`verify-otp`, { phoneNumber, otp });
//         if (response.status === 200 && response.data.success) {
//             return { success: true, message: 'OTP verified successfully!' };
//         } else {
//             return { success: false, message: response.data.message || 'Invalid OTP.' };
//         }
//     } catch (error) {
//         console.error(error);
//         return { success: false, message: 'An error occurred. Please try again later.' };
//     }
// };

// // Function to reset the password
// export const resetPassword = async (phoneNumber: string, newPassword: string) => {
//     try {
//         const response = await apiClient.post<any>(`reset-password`, { phoneNumber, newPassword });
//         if (response.status === 200 && response.data.success) {
//             // Optionally, set a cookie or do any further processing, like logging in the user.
//             setCookie('auth_token', response.data.token, { maxAge: 60 * 60 * 24 });  // Example of setting a cookie
//             return { success: true, message: 'Password reset successfully!' };
//         } else {
//             return { success: false, message: response.data.message || 'Failed to reset password' };
//         }
//     } catch (error) {
//         console.error(error);
//         return { success: false, message: 'An error occurred. Please try again later.' };
//     }
// };