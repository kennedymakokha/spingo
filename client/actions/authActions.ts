/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axios from "axios";
import { parseServerActionResponse } from "../lib/utils";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";

// import { auth } from "@/auth";
// import { parseServerActionResponse } from "@/lib/utils";
export const fetchwallet = async () => {

    const cookieStore: any = cookies();
    // console.log("Cookies available:", cookieStore.getAll());
    // return
    const token =  cookieStore.get("token")?.value; // Assuming you store the JWT in a cookie

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
        const result = await fetch(`http://localhost:4000/api/auth/login`, requestOptions)

        // localStorage.setItem("accessToken", result.data.accessToken);
        const finalresult = await result.json()
        console.log(finalresult)
        // localStorage.setItem("accessToken", finalresult.accessToken);
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })
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

        const result = await fetch(`http://localhost:4000/api/auth/register`, requestOptions)

        const finalresult = await result.json()
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })
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
        const result = await fetch(`http://localhost:4000/api/auth/logout`, requestOptions)

        const finalresult = await result.json()
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

        const result = await fetch(`http://localhost:4000/api/auth`, requestOptions)

        const finalresult = await result.json()
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}