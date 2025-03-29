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
    const fetchData = async () => {
        try {
            setLoading(true); // Start loading
            const results = await apiClient().get<any>(`auth/admin/users?page=${currentPage}&limit=${limit}`);

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
    return (
        <div className="px-0">
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-8">
                    <Table loading={loading} data={data ? data : []} setCurrentPage={setCurrentPage} currentPage={setCurrentPage} totalPages={totalPages} />
            </div>
        </div>
    )
}

export default page