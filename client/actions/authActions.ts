/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { parseServerActionResponse } from "../lib/utils";



// import { auth } from "@/auth";
// import { parseServerActionResponse } from "@/lib/utils";


export const loginUser = async (form: any) => {
    // const session = <any>await auth();
    // if (!session) return parseServerActionResponse({ error: "Not Authorised", status: "Error" })
    // const { title, description, category, image } = Object.fromEntries(
    //     Array.from(form).filter(([key]) => key !== 'pitch')
    // )
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
        console.log(result)
        const finalresult = await result.json()
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}
export const RegistetrUser = async (form: any) => {
    // const session = <any>await auth();
    // if (!session) return parseServerActionResponse({ error: "Not Authorised", status: "Error" })
    // const { title, description, category, image } = Object.fromEntries(
    //     Array.from(form).filter(([key]) => key !== 'pitch')
    // )
    const { phone_number, password, name, } = form
    try {
        const user = {
            phone_number, password, name
        }
        const requestOptions = {
            method: "POST", // Specify the request method
            headers: { "Content-Type": "application/json" }, // Specify the content type
            body: JSON.stringify(user) // Send the data in JSON format
        };
        const result = await fetch(`http://localhost:4000/api/auth/register`, requestOptions)
        console.log(result)
        const finalresult = await result.json()
        return parseServerActionResponse({ ...finalresult, error: "", status: "SUCCESS" })
    } catch (error) {
        console.log(error)
        return parseServerActionResponse({ error: JSON.stringify(error), status: 'Error' })
    }

}