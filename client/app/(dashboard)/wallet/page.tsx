'use client'
import { fetchwallet } from '@/actions/authActions';
import SuccessFailure from '@/components/successFailure';
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CardContent } from '@/components/ui/cardComponent'
import TransactionCard from '@/components/ui/transactionCard';
import apiClient from '@/lib/apiClient';
import { formatDate } from '@/lib/utils';
import { Transaction, WalletData } from '@/types/transactions';
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from 'react'

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);

  const [transactions, setTransactions] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [success, setSuccess] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [item, setItem] = useState({
    amount: 0,
    type: "deposit"
  })


  const fetchData = async () => {
    try {
      setLoading(true); // Start loading
      const response = await apiClient().get<any>(`wallet`);
      setData(response?.data);

      const results = await apiClient().get<any>(`wallet/contributions?page=1&limit=3`);
      setTransactions(results.data.contributions.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

    } catch (err) {
      setError("Error loading data");
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    fetchData();
  }, []);



  const submit = async () => {
    try {
      setLoading(true); // Start loading
      await apiClient().post(`wallet`, item)

      await fetchData();
      setIsModalOpen(false)
    } catch (error: any) {
      setIsModalOpen(false)
      setError(error?.response?.data);
    } finally {
      setLoading(false); // Stop loading
    }
  }
  return (
    <div className="min-h-screen min-w-[83vw]   rounded-md flex flex-col items-center p-6">
      <SuccessFailure success={success} error={error} />
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl bg-white">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-blue-500">Balance</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-gray-900">Ksh {data?.total_amount}</p>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-md">
        <Button
          onClick={() => {
            setIsModalOpen(true);
            setItem(prev => ({
              ...prev, type: "withdraw"
            }))
          }}
          className="flex items-center gap-2 p-4 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
          </svg>
          Send Money
        </Button>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 p-4 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          Add Funds
        </Button>
      </div>
      <h2 className="text-xl font-semibold mt-8 mb-4">Recent Transactions</h2>
      <div className="w-full max-w-md space-y-4">
        {
          loading ? [...Array(3)].map((data, i) => (
            <TransactionCard key={i} trans={{ amount: "000" }} />
          )) :
            transactions?.map((trans: any) => (
              <TransactionCard key={trans?._id} trans={trans} />
            ))}

      </div>
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-[#1018289e] bg-opacity-90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg shadow-lg w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl text-black font-semibold">{item.type === "deposit" ? "Deposit Cash" : "Withdraw cash"}</h2>
                <button onClick={() => setIsModalOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="number"
                placeholder="Enter amount"
                onChange={(e) => setItem(prev => ({
                  ...prev, amount: parseInt(e.target.value)
                }))}
                className="w-full p-2 border text-black rounded-md mb-4"
              />
              <Button onClick={submit} className="w-full bg-green-300 font-bold">{item.type === "deposit" ? "Deposit Cash" : "Withdraw cash"}</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

export default page


