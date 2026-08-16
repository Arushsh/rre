import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'glass' | 'accent' | 'outline' | 'dark';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  icon,
  variant = 'glass',
  className = '',
}) => {
  const variantStyles = {
    glass: 'bg-white/5 border border-white/10 text-white/90 backdrop-blur-md',
    accent: 'bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF]',
    outline: 'bg-transparent border border-white/20 text-white/70',
    dark: 'bg-neutral-900 border border-neutral-800 text-neutral-300',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
};

export default Badge;
