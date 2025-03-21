import { createSlice } from "@reduxjs/toolkit";


interface UserInfo {
    username?: string;
    email?: string;
    token?: string;
    // Add other properties as needed
}

interface InitialState {
    user: UserInfo | null;
    userInfo: UserInfo | null;
}

const initialState: InitialState = {
    user: null, // Define how you want to initialize `user`
    userInfo: (() => {
        try {
            const storedData = localStorage.getItem("userInfo");
            return storedData ? (JSON.parse(storedData) as UserInfo) : null;
        } catch (error) {
            console.error("Error parsing userInfo from localStorage:", error);
            return null;
        }
    })()
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.userInfo = action.payload;
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
            localStorage.setItem('token', action.payload.token)
        },

        login: (state, action) => {

        },
        logout: (state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo')
            localStorage.removeItem('token')



        },

    }
})
export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
