import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'strong' | 'floating';
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  hoverEffect = true,
  ...props
}) => {
  const variantClasses = {
    default: 'glass-default',
    subtle: 'glass-subtle',
    strong: 'glass-strong',
    floating: 'glass-floating',
  };

  return (
    <motion.div
      className={`rounded-2xl md:rounded-3xl p-6 md:p-8 transition-all duration-500 relative overflow-hidden ${
        variantClasses[variant]
      } ${hoverEffect ? 'hover:border-white/25 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

