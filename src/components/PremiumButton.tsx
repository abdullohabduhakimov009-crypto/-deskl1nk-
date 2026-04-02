import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface PremiumButtonProps {
  children?: React.ReactNode;
  onClick?: (e?: any) => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  glow?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  iconPosition?: 'left' | 'right';
  title?: string;
}

export const PremiumButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className = "", 
  glow = false,
  icon,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  iconPosition = 'right',
  title
}: PremiumButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull (limited to 10px for a more subtle feel)
    x.set(distanceX * 0.15);
    y.set(distanceY * 0.15);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const variants = {
    primary: "bg-[#2DD4BF] text-black shadow-[0_8px_30px_rgb(45,212,191,0.3)] hover:shadow-[0_8px_30px_rgb(45,212,191,0.5)] border border-black/5",
    secondary: "bg-white/5 border border-white/10 text-white backdrop-blur-xl hover:bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
    outline: "bg-transparent border-2 border-[#2DD4BF]/50 text-[#2DD4BF] hover:bg-[#2DD4BF]/5 hover:border-[#2DD4BF]",
    ghost: "bg-transparent hover:bg-white/5",
    danger: "bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_8px_30px_rgb(244,63,94,0.3)] hover:shadow-[0_8px_30px_rgb(244,63,94,0.5)] border border-white/10"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-2xl"
  };

  return (
    <motion.button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      title={title}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      initial="initial"
      whileHover="hovered"
      whileTap={disabled || loading ? {} : { scale: 0.97 }}
      className={`
        group relative font-bold transition-all duration-300
        flex items-center justify-center gap-3 overflow-hidden
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${glow && variant === 'primary' ? 'shadow-[0_0_40px_rgba(45,212,191,0.4)]' : ''}
        ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Background Fill Animation */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={{
          initial: { scale: 0, opacity: 0 },
          hovered: { scale: 1.5, opacity: 1 }
        }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className={`
          w-full h-full rounded-full blur-3xl
          ${variant === 'primary' ? 'bg-white/10' : 'bg-brand-teal/10'}
        `} />
      </motion.div>

      {/* Content */}
      <span className={`relative z-10 flex items-center gap-2 ${fullWidth ? 'w-full' : ''} ${iconPosition === 'left' ? 'flex-row-reverse' : ''}`}>
        {loading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
          />
        ) : (
          <>
            {children && <span className={`font-bold tracking-tight ${fullWidth && icon ? 'flex-1 text-left' : ''}`}>{children}</span>}
            {icon && (
              <motion.span
                variants={{
                  initial: { x: 0, scale: 1 },
                  hovered: { x: children ? (iconPosition === 'right' ? 3 : -3) : 0, scale: 1.05 }
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="flex shrink-0"
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
      </span>

      {/* Inner Border Glow */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/5 pointer-events-none" />
    </motion.button>
  );
};
