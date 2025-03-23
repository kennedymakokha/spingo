import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
const SuccessFailure = ({ success, error }: { success: string, error: string }) => {
    return (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-red-500 text-white text-sm text-center p-2 rounded-md mb-4"
                >
                    {error}
                </motion.div>
            )}
            {success && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-green-500 text-white text-sm text-center p-2 rounded-md mb-4"
                >
                    {success}
                </motion.div>
            )}
        </AnimatePresence>

    )
}

export default SuccessFailure