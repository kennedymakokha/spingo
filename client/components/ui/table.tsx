import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';
import TypewriterEffect from '../typewriter';
import apiClient from '@/lib/apiClient';


const Table = ({ handleSubmit,iserror,handleChange, newUser, data,setIsModalOpen, isModalOpen,add, setCurrentPage, currentPage, totalPages, check }: any) => {
    // const [isModalOpen, setIsModalOpen] = useState(false);
    // const [iserror, setIsError] = useState("");
    // const [newUser, setNewUser] = useState({
    //     phone_number: '',
    //     password: '',

    // });

    if (!data || data.length === 0) return <div className="flex w-[80vw] h-[100vh] justify-center items-center bg-slate-900">
        {/* {TypewriterEffect({ time: 10, text: "No data available" })} */}
        <TypewriterEffect speed={70} text="No data available" />
    </div>;
    const headers = Object.keys(data[0]);

    
  

    return (
        <div className="rounded-t-lg">
            {add && (
                <div className="flex justify-start">
                    <div className="flex px-2 py-1 border rounded-md shadow-3xl">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-blue-600"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                            </svg>

                        </button>
                    </div>
                </div>
            )}

            <motion.table
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-full bg-slate-300 mt-4 w-full shadow-lg p-6 rounded-t-lg"
            >
                <thead>
                    <tr className="bg-slate-500">
                        {headers.map((header, index) => (
                            <th className="py-2 px-4 border-b text-left text-gray-700" key={index}>
                                {header.replace(/_/g, ' ').charAt(0).toUpperCase() + header.slice(1)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <motion.tbody
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {data.map((row: any, rowIndex: any) => (
                        <motion.tr
                            key={rowIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: rowIndex * 0.1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`odd:bg-slate-200`}
                        >
                            {headers.map((header, colIndex) => (
                                <td className="py-2 px-4 border-b text-gray-600" key={colIndex}>
                                    {header === 'createdAt' || header === 'updatedAt'
                                        ? formatDate(row[header])
                                        : row[header]}
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </motion.tbody>
            </motion.table>

            <div className="flex justify-between px-10 min-w-full py-3 bg-slate-200 space-x-4 rounded-b-lg">
                {/* Previous Button */}
                <motion.button
                    onClick={() => setCurrentPage((prev: any) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Previous
                </motion.button>
                <motion.button
                    onClick={() => setCurrentPage((prev: any) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="py-2 px-4 bg-blue-600 text-white rounded-md disabled:opacity-50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Next
                </motion.button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="bg-white p-6 rounded-lg shadow-xl w-1/3"
                    >
                        <h2 className="text-xl font-semibold mb-4">Create Admin</h2>
                        {iserror && <div className="flex bg-red-400 px-2 rounded-md text-sm">{iserror}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Name</label>
                                <input
                                    type="number"
                                    name="phone_number"
                                    value={newUser.phone_number}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Email</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={newUser.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border rounded-md"
                                />
                            </div>

                            <div className="flex justify-between mt-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Submit
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )
            }
        </div >
    );
};

export default Table;
