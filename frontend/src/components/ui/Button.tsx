import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  variant?: 'primary' | 'glass' | 'ghost' | 'secondary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  disabled = false,
  onClick,
  ...props
}) => {
  const variantStyles = {
    primary: 'btn-vantage-primary',
    glass: 'btn-vantage-glass',
    ghost: 'btn-vantage-ghost',
    secondary: 'btn-vantage-secondary',
    destructive: 'bg-red-950/80 text-red-200 border border-red-800/50 hover:bg-red-900/90',
  };

  const sizeStyles = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-4 text-[12px]',
    lg: 'px-10 py-5 text-[13px]',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-3 font-bold uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none' : ''} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
