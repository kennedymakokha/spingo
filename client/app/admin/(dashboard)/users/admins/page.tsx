'use client'
import Table from '@/components/ui/table';
import apiClient from '@/lib/apiClient';
import { formatDate } from '@/lib/utils';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any>(null);
    const [data, setdata] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [limit] = useState<number>(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [iserror, setIsError] = useState("");
    const [newUser, setNewUser] = useState({
        phone_number: '',
        password: '',

    });
    const fetchData = async () => {
        try {
            setLoading(true); // Start loading
            const results = await apiClient().get<any>(`auth/admin/users/admins?page=${currentPage}&limit=${limit}`);

            setTotalPages(results.data.totalPages);
            setCurrentPage(results.data.page);
            setdata(results.data.users)

        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false); // Stop loading
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            // You can integrate API call here for adding the user
            const results = await apiClient().post<any>(`auth/admin-register`, newUser);
            await fetchData();
            setIsModalOpen(false);
        } catch (error: any) {
            setIsError(error.response.data)
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <div className="px-0">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                <Table
                    handleSubmit={handleSubmit}
                    isModalOpen={isModalOpen} handleChange={handleChange} newUser={newUser} setIsModalOpen={setIsModalOpen} iserror={iserror} add loading={loading} data={data ? data : []} setCurrentPage={setCurrentPage} currentPage={setCurrentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}

export default page