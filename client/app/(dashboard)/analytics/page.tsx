'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";
import apiClient from "@/lib/apiClient";


// import { useLoginMutation } from "@/app/features/slices/userSlice";

import { Bar } from 'react-chartjs-2'; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { formatDate } from "@/lib/utils";

// Register the components required for the chart
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Card = ({ title, amount }: { title: string, amount: number }) => {
  return (
    <motion.div
      className="bg-slate-300 shadow-lg p-6 rounded-lg"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className="text-xl font-semibold text-slate-600 capitalize text-gray-700">{title.replace(/-/g, ' ')}</h3>
      <p className={`text-2xl font-bold ${title === "deposit" ? "text-green-500" : title === "withdraw" ? "text-yellow-500" : title === "stake-won" ? "text-green-800" : "text-red-500"}`}>{amount}</p>
    </motion.div>

  )
}
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
      const results = await apiClient().get<any>(`wallet/contributions?page=${currentPage}&limit=${limit}`);
      setTransactions(results.data.summedData);
      setTotalPages(results.data.totalPages);
      setCurrentPage(results.data.page);
      setdata(results.data.contributions)

    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false); // Stop loading
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const chartData = {
    labels: transactions?.map((item: any) => item.type.replace('-', ' ').toUpperCase()), // Labels for the chart (stake-won, stake-lost)
    datasets: [
      {
        label: 'Amount',
        data: transactions?.map((item: any) => item.amount), // Data (amounts for each type)
        backgroundColor: ['#fb2c36', '#00c951', '#f0b100', "#016630"], // Colors for each bar
        borderColor: ['#388e3c', '#d32f2f'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const, // Use 'top' as a valid literal
      },
      title: {
        display: true,
        text: 'Transaction Summary',
      },
    },
  };


  if (loading) {
    // Show loader if data is still loading
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="spinner-border animate-spin border-4 border-blue-600 rounded-full w-16 h-16"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-8">
      {/* Page Header */}
     
      {/* Main Analytics Cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {transactions?.map((trans: any) => (
          <Card key={trans.type} title={trans.type} amount={trans.amount} />
        ))}
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        <motion.div
          className="mt-16 bg-slate-300 shadow-lg p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Contribution  (Last 6 Months)</h3>

          <div className="bg-slate-200 h-64 rounded-lg flex justify-center items-center text-gray-600">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>
        <div>
          <table className="min-w-full bg-slate-300 mt-16  shadow-lg p-6 rounded-lg ">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left text-gray-700">Type</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Amount</th>
                <th className="py-2 px-4 border-b text-left text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((transaction: any) => (
                <tr key={transaction._id} className={transaction.type === 'stake-lost' ? 'bg-red-100' : 'bg-green-100'}>
                  <td className="py-2 px-4 border-b text-gray-600">{transaction.type}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{transaction.amount}</td>
                  <td className="py-2 px-4 border-b text-gray-600">{formatDate(transaction.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center min-w-full mt-6 space-x-4">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>

          
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>



      </div>
    </div>

  );
};

export default page;
