import React from "react";
import { motion } from "framer-motion";

export const TypingAnimation = ({ text, className, delay = 0, speed = 0.04 }: { text: string, className?: string, delay?: number, speed?: number }) => {
  const characters = text.split("");
  
  return (
    <span className={`inline-block ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{
            duration: 0.01,
            delay: delay + index * speed,
            ease: "linear"
          }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};
