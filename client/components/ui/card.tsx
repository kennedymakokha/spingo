import React from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional classes

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn("bg-white shadow-md rounded-2xl p-4", className)} {...props}>
      {children}
    </div>
  );
};
