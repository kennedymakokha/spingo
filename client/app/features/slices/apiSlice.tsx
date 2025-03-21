import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// export const bURl = "https://rent-space.onrender.com/"
export const bURl = "http://localhost:4000/"
// const baseQuery = fetchBaseQuery({ baseUrl: "" })
const getAuth = async () => {
    try {
        let t = localStorage.getItem("token");
        return `${t}`; // Return the retrieved token
    } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error; // Rethrow the error to handle it further up the call stack if needed
    }
}

const baseQuery = fetchBaseQuery({
    baseUrl: bURl,
    prepareHeaders: async (headers: any) => {
        let token = await getAuth()
        headers.set('Authorization', `Bearer ${token}`)
        return headers;
    },
})
export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['User'],
    endpoints: (builder: any) => ({})
})