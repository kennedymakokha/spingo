import { apiSlice } from "./apiSlice";
const USER_URL = "/api/users";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/login`,
                method: "POST",
                body: data
            })
        }),
        post_user: builder.mutation({
            query: (data) => {

                return {
                    url: `${USER_URL}`,
                    method: "POST",
                    body: data
                }
            }
        }),
        post_guardian: builder.mutation({
            query: (data) => {

                return {
                    url: `${USER_URL}/guardian`,
                    method: "POST",
                    body: data
                }
            }
        }),
        recoverPass: builder.mutation({
            query: (data) => {

                return {
                    url: `${USER_URL}/recover-password`,
                    method: "POST",
                    body: data
                }
            }
        }),
        resetPass: builder.mutation({
            query: (data) => {

                return {
                    url: `${USER_URL}/reset-password`,
                    method: "POST",
                    body: data
                }
            }
        }),

       
        editUserDetails: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data._id}`,
                method: "PUT",
                body: data
            })
        }),
        enrollUser: builder.mutation({
            query: (_id) => ({
                url: `${USER_URL}/enroll/${_id}`,
                method: "PUT",
                
            })
        }),

        fetchuser: builder.query({
            query: (id) => ({
                url: `${USER_URL}/${id}`
            })
        }),
        fetch_count: builder.query({
            query: () => ({
                url: `${USER_URL}/count`
            })
        }),

        activate: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/activate/${data.id}`,
                method: "PUT",
                body: data
            })
        }),
        Resendactivate: builder.mutation({
            query: (data) => {
                return (
                    {
                        url: `${USER_URL}/sms/resend-activation-key/${data.id}`,
                        method: "POST",

                    }
                )
            }
        }),
        get_users: builder.query({
            query: (data) => `${USER_URL}?role=${data.role}&page=${data.page}&limit=${data.limit}&word=${data.word}`
        }),
        delete_user: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: "DELETE",
            })
        }),
        update_user: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data._id}`,
                method: "PUT",
                body: data
            })
        }),
        logout: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/logout`,
                method: "POST",
                body: data
            })
        })
    })
})

export const { useLoginMutation, useFetch_countQuery, useEnrollUserMutation, usePost_guardianMutation, useUpdate_userMutation, useDelete_userMutation, useResetPassMutation, useRecoverPassMutation, useResendactivateMutation, useActivateMutation, useGet_usersQuery, useEditUserDetailsMutation, useLogoutMutation, usePost_userMutation, useFetchuserQuery } = usersApiSlice