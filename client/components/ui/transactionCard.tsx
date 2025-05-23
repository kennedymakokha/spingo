import React from 'react'
import { Card } from './card'
import { formatDate } from '@/lib/utils'

const TransactionCard = ({ trans }: any) => {
    return (
        <Card key={trans?._id} className="p-4 shadow rounded-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${trans?.type === "deposit" || trans?.type === "stake-won" ? "text-green-500" : trans?.type === "withdraw" ? "text-yellow-500" : "text-red-500"}  `}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
                    </svg>
                    <div>
                        <p className="text-sm text-gray-500">{formatDate(trans?.createdAt)} {trans.type}</p>
                    </div>
                </div>
                <p className={`${trans?.type === "deposit" || trans?.type === "stake-won" ? "text-green-500" : trans?.type === "withdraw" ? "text-yellow-500" : "text-red-500"} `}>
                    {(trans?.type === "withdraw" || trans?.type === "stake-lost" && "-") + trans?.amount}
                </p>
            </div>
        </Card>
    )
}

export default TransactionCard