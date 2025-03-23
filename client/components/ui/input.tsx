import React from 'react'
import { motion, AnimatePresence } from "framer-motion";
const Input =  ({ value, type, placeholder, onChange }: { value: any, type?: string, placeholder: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void })=> {
    return (
        <motion.div whileFocus={{ scale: 1.05 }}>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full p-2 border  text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </motion.div>
    )
}

export default Input