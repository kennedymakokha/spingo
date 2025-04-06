import React from 'react';
import { motion } from "framer-motion";

const Input = ({
    value,
    type = "text", // Default type is 'text'
    placeholder,
    onChange,
}: {
    value: any;
    type?: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    return (
        <motion.div whileFocus={{ scale: 1.05 }}>
            <input
                type={type}
                autoComplete="off" // Corrected to off for better experience
                autoCorrect="off"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22b14c] hover:ring-[#22b14c] transition duration-200 ease-in-out"
            />
        </motion.div>
    );
};

export default Input;
