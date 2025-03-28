/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axios from "axios";
import { parseServerActionResponse } from "../lib/utils";
import { cookies } from "next/headers";
import apiClient from "@/lib/apiClient";


export const fetchwallet = async () => {

    const cookieStore: any = cookies();

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


export const fetchwalletContributions = async () => {

    const cookieStore: any = cookies();

    const token = cookieStore.get("token")?.value; // Assuming you store the JWT in a cookie

    if (!token) {
        console.log("unauth")
    }

    try {
        const api = apiClient();
        const { data } = await api.get("/wallet/contributions");
        return parseServerActionResponse({ ...data, error: "", status: "SUCCESS" })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}

