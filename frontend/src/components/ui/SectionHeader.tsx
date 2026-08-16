import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
  index?: string;
  category?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  index,
  category,
  title,
  description,
  action,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 md:mb-20 ${centered ? 'text-center max-w-3xl mx-auto' : 'flex flex-col md:flex-row justify-between items-start md:items-end gap-8'} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl"
      >
        <div className={`flex items-center gap-4 mb-4 ${centered ? 'justify-center' : ''}`}>
          {index && (
            <span className="text-[11px] font-extrabold tracking-[0.3em] text-[#00E5FF]">
              {index}
            </span>
          )}
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
              {category}
            </span>
          )}
        </div>
        
        <h2 className="heading-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.05]">
          {title}
        </h2>
        
        {description && (
          <p className="editorial-subhead text-base sm:text-lg text-white/70 font-normal leading-relaxed">
            {description}
          </p>
        )}
      </motion.div>

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="shrink-0"
        >
          {action}
        </motion.div>
      )}
    </div>
  );
};

export default SectionHeader;
