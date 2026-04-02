import React from 'react';
import { motion } from 'framer-motion';

interface AILogoProps {
  className?: string;
  size?: number;
  onClick?: () => void;
}

const AILogo: React.FC<AILogoProps> = ({ className = "", size = 40, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative flex items-center justify-center group rounded-full ${className}`} 
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full bg-black border border-white/10 rounded-full flex items-center justify-center text-brand-teal shadow-2xl transition-all group-hover:border-brand-teal/50 group-hover:shadow-brand-teal/10 overflow-hidden">
        <div className="relative flex items-center justify-center">
          {/* Gemini Star SVG */}
          <svg 
            width={size * 0.5} 
            height={size * 0.5} 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            <path 
              d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" 
              fill="currentColor"
              className="drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]"
            />
          </svg>
          
          <motion.div
            className="absolute inset-0 bg-brand-teal blur-xl opacity-0 group-hover:opacity-60 transition-opacity"
            animate={{
              scale: [1, 2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />
        </div>
      </div>
      
      {/* Premium Animated Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-brand-teal/20 rounded-full blur-md -z-10"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};

export default AILogo;
