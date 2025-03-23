import React from "react";
import { cn } from "@/lib/utils"; // Import the utility function

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "danger";
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}) => {
  const variantClasses = {
    default: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button 
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-colors", 
        variantClasses[variant], 
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
