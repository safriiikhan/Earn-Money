
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.05] ${className} ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
    >
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-600/10 blur-[60px]"></div>
      <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-600/10 blur-[60px]"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default GlassCard;
