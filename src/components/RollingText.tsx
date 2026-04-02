import React from "react";
import { motion } from "framer-motion";

interface RollingTextProps {
  text: string;
  className?: string;
  isActive?: boolean;
}

export const RollingText = ({ text, className = "", isActive = false }: RollingTextProps) => {
  return (
    <div className={`relative overflow-hidden h-[1.2em] flex flex-col ${className}`}>
      <motion.div
        className="flex flex-col"
        variants={{
          initial: { y: 0 },
          hovered: { y: "-50%" }
        }}
        transition={{ 
          duration: 0.45, 
          ease: [0.65, 0, 0.35, 1] // Smoother, more balanced easing
        }}
      >
        <span className="flex items-center h-[1.2em] whitespace-nowrap">
          {text}
        </span>
        <span className="flex items-center h-[1.2em] whitespace-nowrap">
          {text}
        </span>
      </motion.div>
    </div>
  );
};
